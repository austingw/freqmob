export default function Page({ params }: { params: { board: string } }) {
	console.log(params.board)
	return <div>My Post: {params.board}</div>
}
