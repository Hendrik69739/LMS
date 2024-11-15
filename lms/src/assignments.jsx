import './assignments.css'
import { Link} from 'react-router-dom'

function Assignment(){
return(
    <div id='assignment_body'>
    <nav><p><Link>Assignment</Link> {'>'} <Link>Task</Link></p> </nav>
    <div id='task'>

    </div>
    <div id='task'>
        <div>Mathematics</div>
        <div>
            <p>date </p>
            <p>time</p>
        </div>
    </div>
    </div>
)
}

export default Assignment;