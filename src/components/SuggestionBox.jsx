

import { useNavigate } from "react-router"

export default function SuggestionBox({ results }) {
	const navigate = useNavigate()
  return (
    <div className="flex justify-center mt-4">
      {results.length > 0 && (
				<ul className="bg-white border border-gray-300 rounded w-[80%] sm:w-[50%] max-h-40 overflow-y-auto">
				{results && results.map((result, index) => (
					<li key={index} onClick={() => {navigate(`/searched-place?name=${result}`)}} className="py-2 px-4 hover:bg-gray-100 cursor-pointer" >
						{result}
					</li>
				))}
				
      </ul>
			)}
    </div>
  );
}