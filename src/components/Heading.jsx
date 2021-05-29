import React from 'react';

function Heading() {
    return (
      <div className='heading'>
          <h1>S P E Q L 8</h1>
          <p id="catchPhrase">← grow with confidence →</p>
          <div id="goldThing">
            <img src="https://cdn.discordapp.com/attachments/825520363151556638/847590984456208384/gold_leaf_line.png" height='60px' width='200px'></img>
          </div>
          {/* these buttons are going to live in their own element */}
          {/* <button>Schema 1</button>
          <button>Schema 2</button>
          <button>Schema 3</button> */}
      </div>
    )
}

export default Heading;