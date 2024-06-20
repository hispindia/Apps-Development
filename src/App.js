import React from 'react'
import { htmlFile } from './htmlFile'

const MyApp = () => (
    <div>
        <iframe srcDoc={htmlFile} style={{height:"92vh", width:"100vw"}}
        sandbox="allow-same-origin allow-scripts allow-modals allow-downloads allow-popups" ></iframe>
    </div>
)

export default MyApp
