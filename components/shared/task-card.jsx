export default function TaskCard({ task }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h3 className="font-bold text-lg">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <a href={task.gpt_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 inline-block">
        Open Project
      </a>
    </div>
  )
}
