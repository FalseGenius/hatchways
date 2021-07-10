import {useState, useEffect} from 'react';
import './App.css';

const axios = require('axios');

interface User {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  skill: string;
  average: number;
}

interface UserPicture {
  pic: string;
}

interface UserInformation {
  name: User;
  pic: UserPicture;
}

const fetchRandomData = () => {
  return axios.get('https://api.hatchways.io/assessment/students').then(({data}) => {
    return (data);
  })
}

const getUserName = (userInfos: UserInformation) => {
  return `${userInfos.firstName} ${userInfos.lastName} `;
}

const otherDetails = (userInfos) => {
  return <div>
            <p>Email: {userInfos.email}</p>
            <p>Company: {userInfos.company}</p>
            <p>Skill: {userInfos.skill}</p>

          </div>
}

const average = (arr) => {
  let avg = 0;
  arr.map((item, idx) => {
    avg += parseInt(item);
  });

  return `Average: ${avg / arr.length}%`;
}

const showGrades = (grades) => {
  grades.map((item, idx) => (
    console.log(item)
  ));
};


function App() {

  const [fetchUserData, setfetchUserData] = useState('');
  const [userInfo, setUserInfo] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [tagg, setTag] = useState({
    a: [],
    i: Number
  });
  const [show, setShow] = useState({
    bool: false,
    ide: Number,
    plus: '+'
  });

  useEffect(() => {
    fetchRandomData().then(randomData => {
      setfetchUserData(JSON.stringify(randomData) || 'error');
      setUserInfo(randomData.students);
      setSearchResult(randomData.students);
    })
  }, [])

  const handleChange = (event) => {
    let value = event.target.value;
    setSearch(value);

    if (value !== '') {
      const newList = userInfo.filter((item) => {
        return Object.values(item.firstName).concat(' ').concat(item.lastName).join('').toLowerCase().includes(value.toLowerCase());
      })
      setSearchResult(newList);
    } else {
      setSearchResult(userInfo);
    }
  };

  const handleTag = (event) => {
    console.log(event.target.value);
  }

  return (
    <>

      <h1 style={{textAlign: "center"}}>Hello World</h1>
      <pre>{fetchUserData}</pre>
      <div>
          <div className='search'>

            <div className='ui icon input'>
              <input onChange={handleChange} type="text" placeholder="Search by name" ></input>
            </div>

          </div>

          <div className='tag'>
            <input onChange={handleTag} type='text' placeholder='Search by tag'></input>
          </div>

          <div>

            {
              searchResult.map((item: User, idx) => (
                <div style={{marginBottom: '70px'}} >

                  <div style={{float: 'left', paddingTop: '50px'}}>
                    <img style={{margin: '20px', height: '160px', weight: '200px', border: '1px solid black', borderRadius: "50%", color: 'black'}} src={item.pic} />
                  </div>


                    {show.bool
                      ? <button id={{idx}} onClick={()=>setShow({bool: false})} style={{width: '30px', height: '30px' ,float: 'right', marginTop: '30px', border: 'none', backgroundColor: 'gray'}}>+</button>
                      : <button id={{idx}} onClick={()=>setShow({bool: !show.bool, ide: idx, plus: '-'})} style={{width: '30px', height: '30px' ,float: 'right', marginTop: '30px', border: 'none', backgroundColor: 'gray'}}>{show.plus}</button>
                    }




                  <div style={{display: 'inline-block'}}>

                    <p style={{fontWeight: '500', fontSize: '30px'}}>{getUserName(item)}</p>
                    <p>{otherDetails(item)}</p>
                    <p>{average(item.grades)}</p>
                    <ul key={idx} style={{listStyleType: 'none', padding: '0', margin: '0'}}>
                      {
                        show.ide === idx ?

                        item.grades.map((item, idx) => (
                        <li>{`Test ${idx+1}: ${parseInt(item)}%`}</li>
                        ))

                        : null}
                    </ul>
                    {
                      tagg.i === idx ? tagg.a : null
                    }
                    <br></br>
                    <input id={idx} onKeyPress={event => {
                        let val = event.target.value;
                        if (event.key === 'Enter') {

                              setTag({a: [...tagg.a, val + ' '], i: idx});
                              event.currentTarget.value = "";


                            }
                      }} autoComplete='off' type='text' placeholder='Add a tag'></input>

                  </div>

                  <hr style={{color: 'gray', marginTop: '23px'}} />
                </div>
              )
              )
            }
        </div>
      </div>
    </>
  );
}

export default App;
