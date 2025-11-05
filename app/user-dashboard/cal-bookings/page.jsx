"use client";
import { useEffect, useState } from "react";
import { Calendar, Clock, Users, Video, MapPin, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";

export default function MyBookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/cal/bookings`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const text = await res.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        
        const json = JSON.parse(text);
        setItems(json.bookings || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const now = new Date();
  const upcomingBookings = items.filter(booking => new Date(booking.startTime) >= now);
  const pastBookings = items.filter(booking => new Date(booking.startTime) < now);

  // Group bookings by date
  const groupBookingsByDate = (bookings) => {
    const grouped = {};
    bookings.forEach(booking => {
      const dateStr = new Date(booking.startTime).toDateString();
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(booking);
    });

    // Sort dates and bookings within each date
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    const result = {};
    sortedDates.forEach(date => {
      result[date] = grouped[date].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    });

    return result;
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty days for the previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toDateString();
    return upcomingBookings.filter(booking => 
      new Date(booking.startTime).toDateString() === dateStr
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const formatTime = (startTime, endTime) => {
    const start = new Date(startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const end = new Date(endTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${start} - ${end}`;
  };

  const getStatusColor = (startTime) => {
    const bookingDate = new Date(startTime);
    const timeDiff = bookingDate.getTime() - now.getTime();
    const hoursUntil = timeDiff / (1000 * 3600);

    if (hoursUntil < 0) return 'text-gray-500';
    if (hoursUntil <= 24) return 'text-green-600';
    return 'text-blue-600';
  };

  const getStatusIcon = (startTime) => {
    const bookingDate = new Date(startTime);
    const timeDiff = bookingDate.getTime() - now.getTime();
    const hoursUntil = timeDiff / (1000 * 3600);

    if (hoursUntil < 0) return <CheckCircle className="w-4 h-4" />;
    if (hoursUntil <= 24) return <AlertCircle className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-900">Error Loading Bookings</h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const BookingItem = ({ booking, isPast = false }) => (
    <div className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
      isPast ? 'opacity-75' : ''
    }`}>
      <div className="w-24 text-sm font-medium text-gray-700">
        {formatTime(booking.startTime, booking.endTime)}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isPast ? 'bg-gray-100' : 'bg-blue-100'
          }`}>
            <div className={getStatusColor(booking.startTime)}>
              {getStatusIcon(booking.startTime)}
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">
              {booking.eventType?.title || "Event"}
            </h4>
            
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              {booking.attendees && booking.attendees.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{booking.attendees.length} attendee{booking.attendees.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              
              {booking.metadata?.videoCallUrl && (
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>Video call</span>
                </div>
              )}
            </div>

            {booking.attendees && booking.attendees.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {booking.attendees.map((attendee, index) => (
                  <div key={index}>
                    {attendee.name || "Unknown"} ({attendee.email})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {booking.metadata?.videoCallUrl && (
          <a 
            href={booking.metadata.videoCallUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4" />
            Join Call
          </a>
        )}
        
        {!isPast && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Upcoming
          </span>
        )}
        
        {isPast && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Completed
          </span>
        )}
      </div>
    </div>
  );

  const ListView = ({ bookings, isPast = false }) => {
    const groupedBookings = groupBookingsByDate(bookings);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {Object.keys(groupedBookings).length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isPast ? 'No past bookings' : 'No upcoming bookings'}
            </h3>
            <p className="text-gray-600">
              {isPast 
                ? "You don't have any completed appointments yet." 
                : "You don't have any scheduled appointments coming up."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedBookings).map(([dateStr, dateBookings]) => (
              <div key={dateStr} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {formatDateHeader(dateStr)}
                </h3>
                <div className="space-y-1">
                  {dateBookings.map((booking) => (
                    <BookingItem key={booking.id} booking={booking} isPast={isPast} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const CalendarView = () => {
    const days = getDaysInMonth(currentMonth);
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex max-h-[580px]">
          {/* Calendar Section */}
          <div className="flex-1 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayBookings = day ? getBookingsForDate(day) : [];
                const isToday = day && day.toDateString() === now.toDateString();
                const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[60px] p-2 border border-gray-200 transition-all ${
                      day ? 'hover:bg-blue-50 cursor-pointer' : ''
                    } ${isSelected ? 'bg-blue-100 border-blue-300' : ''} ${
                      isToday ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {day.getDate()}
                        </div>
                        {dayBookings.length > 0 && (
                          <div className="text-xs text-center bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                            {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details Sidebar */}
          <div className="w-80 overflow-auto border-l border-gray-200 bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedDate ? `${formatDate(selectedDate)}` : 'Select a Date'}
            </h3>
            
            {selectedDate ? (
              <div className="space-y-3">
                {getBookingsForDate(selectedDate).length > 0 ? (
                  getBookingsForDate(selectedDate).map(booking => (
                    <div key={booking.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {booking.eventType?.title || "Event"}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(booking.startTime, booking.endTime)}</span>
                        </div>
                      </div>

                      {booking.attendees && booking.attendees.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Users className="w-4 h-4" />
                            <span>Attendees ({booking.attendees.length})</span>
                          </div>
                          <div className="space-y-1">
                            {booking.attendees.map((attendee, index) => (
                              <div key={index} className="text-sm text-gray-600 pl-2">
                                <div className="font-medium">{attendee.name || "Unknown"}</div>
                                <div className="text-gray-500">{attendee.email}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {booking.metadata?.videoCallUrl && (
                        <div className="pt-2 border-t border-gray-200">
                          <a 
                            href={booking.metadata.videoCallUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                          >
                            <Video className="w-4 h-4" />
                            Join Video Call
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No bookings for this date</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Click on a date to view bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-8 h-8 text-blue-600" />
          My Bookings
        </h1>
        <p className="text-gray-600 mt-2">Manage your scheduled appointments and meetings</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">You don't have any scheduled appointments yet.</p>
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Upcoming ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-2 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === 'past'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Past ({pastBookings.length})
              </button>
            </div>

            {/* View Mode Toggle - Only show for upcoming tab */}
            {activeTab === 'upcoming' && (
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    viewMode === 'calendar'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
                </button>
              </div>
            )}
          </div>

          {/* Bookings Content */}
          <div className="space-y-4">
            {activeTab === 'upcoming' && (
              <>
                {viewMode === 'calendar' ? (
                  <CalendarView />
                ) : (
                  <ListView bookings={upcomingBookings} isPast={false} />
                )}
              </>
            )}

            {activeTab === 'past' && (
              <ListView bookings={pastBookings} isPast={true} />
            )}
          </div>
        </>
      )}
    </div>
  );
}