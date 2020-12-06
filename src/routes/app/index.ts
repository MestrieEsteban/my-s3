import { Router, Request, Response } from 'express'

const app = Router()

app.get('/', (req: Request, res: Response) => {
  const html = `
			<html>
				<head>
					<title>Hello</title>
				</head>
				<body>
					Hello
				</body>
			</html>
			`
  res.send(html)
})
export default app
