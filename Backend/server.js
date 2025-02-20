const mongoose=require("mongoose");
const express = require("express")
const axios = require('axios');
const collection = require("./mongo")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())



app.get("/",cors(),(req,res)=>{

})


app.post("/",async(req,res)=>{
    const{email,password}=req.body

    try{
        const check=await collection.findOne({email:email,password:password})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
        }

    }
    catch(e){
        res.json("fail")
    }

})



app.post("/register",async(req,res)=>{
    const{email,password}=req.body

    const data={
        email:email,
        password:password
    }

    try{
        const check=await collection.findOne({email:email})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
            await collection.insertMany([data])
        }

    }
    catch(e){
        res.json("fail")
    }

})



//----------------------
  const newsSchema = new mongoose.Schema({
    title: String,
    keywords: [String],
    link: String,
    creator: [String],
    video_url: String,
    description: String,
    content: String,
    pubDate: String,
    image_url: String,
    source_id: String,
    country: [String],
    category: [String],
    language: String,
  });
  
  const News = mongoose.model("News", newsSchema);


  const newsRouter = express.Router();

newsRouter.get("/", async (req, res) => {
  const news = await News.find();
  res.send(news);
});

newsRouter.post("/add", async (req, res) => {
  const newsData = req.body;
  let news = await News(newsData);
  news.save();
  res.send(news);
});
//---------------------
app.use(cors());

// // Endpoint to search for player by name
// app.get('/api/search/:playerName', async (req, res) => {
//   const playerName = req.params.playerName;
//   const options1 = {
//     method: 'GET',
//     url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search`,
//     params: { plrN: playerName },
//     headers: {
//       'X-RapidAPI-Key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
//       'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
//     }
//   };

//   try {
//     const response = await axios.request(options1);
//     const players = response.data; // Assume this returns a list of players matching the name
//     console.log('Search response:', players);
//     res.json(players);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to search for player' });
//   }
// });

app.get('/api/search/:playerName', async (req, res) => {
  const playerName = req.params.playerName;

  // Check if playerName is provided
  if (!playerName) {
    return res.status(400).json({ error: 'Player name is required' });
  }

  const options1 = {
    method: 'GET',
    url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search`,
    params: { plrN: playerName },
    headers: {
      'X-RapidAPI-Key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
      'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options1);
    const players = response.data || []; // Assume this returns a list of players matching the name

    // Check if no players were found
    if (!players || players === 0) {
      return res.status(404).json({ error: 'No players found with the provided name' });
    }
    

      console.log('Search response:', players);
      res.json(players);
    
    
  } catch (error) {
    console.error(error.message);          //----

    // Check if the error is from RapidAPI
    if (error.response && error.response.data) {
      return res.status(error.response.status).json({ error: error.response.data });
    }

    // General error message for other types of errors
    res.status(500).json({ error: 'Failed to search for player' });
  }
});

// Endpoint to search for player by name with error handling
// app.get('/api/search/:playerName', async (req, res) => {
//   const playerName = req.params.playerName;
//   const options1 = {
//     method: 'GET',
//     url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search`,
//     params: { plrN: playerName },
//     headers: {
//       'X-RapidAPI-Key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
//       'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
//     }
//   };

//   try {
//     const response = await axios.request(options1);
//     const players = response.data; // Assume this returns a list of players matching the name

//     if (players && players.length > 0) {
//       console.log('Search response:', players);
//       res.json(players);
//     } else {
//       res.status(404).json({ error: 'No players found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to search for player' });
//   }
// });


app.get('/api/player/:playerId', async (req, res) => {
  const playerId = req.params.playerId;
  const options2 = {
    method: 'GET',
    url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}`,
    headers: {
      'X-RapidAPI-Key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
      'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options2);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
});

//-----------------
// Endpoint to get news list
app.get('/api/news/list', async (req, res) => {
  const options3 = {
    method: 'GET',
    url: 'https://cricbuzz-cricket.p.rapidapi.com/news/v1/index',
    headers: {
      'X-RapidAPI-Key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
      'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options3);
    res.json(response.data.storyList.filter(item => item.story));
    // res.json(response.data);
  } catch (error) {
    console.error('Error fetching news list:', error.message);
    res.status(500).json({ error: 'Failed to fetch news list' });
  }
});

// Endpoint to get news details
app.get('/api/news/detail/:newsId', async (req, res) => {
  const newsId = req.params.newsId;
  const options = {
    method: 'GET',
    url: `https://cricbuzz-cricket.p.rapidapi.com/news/v1/detail/${newsId}`,
    headers: {
      'X-RapidAPI-Key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
      'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news details:', error.message);
    res.status(500).json({ error: 'Failed to fetch news details' });
  }
});

//--------------------End point for getting record in stats
app.get('/api/stats/get-record-filters', async (req, res) => {
  const options5 = {
    method: 'GET',
    url: 'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/topstats',
    headers: {
      'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
      'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options5);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/stats/get-records', async (req, res) => {
  const { statsType } = req.query;
  const options6 = {
    method: 'GET',
    url: 'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/topstats/0',
    params: { statsType },
    headers: {
      'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
      'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options6);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news details:', error.message);
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

//-----------------
app.get('/api/schedule', async (req, res) => {
  const options = {
      method: 'GET',
      url: 'https://cricbuzz-cricket.p.rapidapi.com/schedule/v1/international',
      headers: {
          'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
          'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
      }
  };

  try {
      const response = await axios.request(options);
      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching schedule data' });
  }
});

//----------------------
app.get('/api/players', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://cricbuzz-cricket.p.rapidapi.com/series/v1/3718/squads/15826',
    headers: {
      'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
      'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
});
//-------------------------------
app.get('/api/players/:teamId', async (req, res) => {
  const teamId = req.params.teamId;
  const options = {
    method: 'GET',
    url: `https://cricbuzz-cricket.p.rapidapi.com/series/v1/3718/squads/15826`,
    headers: {
      'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
      'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data.player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//---------------------------
// const fetchTrendingPlayers = async () => {
//   const options = {
//     method: 'GET',
//     url: `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/trending`,
//     headers: {
//       'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
//       'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
//     }
//   };
//   const response = await axios.request(options);
//   return response.data.player;
// };

// const fetchPlayerCareer = async (playerId) => {
//   const options = {
//     method: 'GET',
//     url: 'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/8733/career',
//     headers: {
//       'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
//       'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
//     }
//   };
//   const response = await axios.request(options);
//   return response.data.values;
// };

// const fetchPlayerBowling = async (playerId) => {
//   const options = {
//     method: 'GET',
//     url: 'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/8733/bowling',
//     headers: {
//       'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
//       'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
//     }
//   };
//   const response = await axios.request(options);
//   return response.data.values;
// };

// const fetchPlayerBatting = async (playerId) => {
//   const options = {
//     method: 'GET',
//     url: 'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/8733/batting',
//     headers: {
//       'x-rapidapi-key': '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5',
//       'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
//     }
//   };
//   const response = await axios.request(options);
//   return response.data.values;
// };

// app.get('/api/trending-players', async (req, res) => {
//   try {
//     const players = await fetchTrendingPlayers();
//     res.json(players);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch trending players' });
//   }
// });

// app.get('/api/player/:id/career', async (req, res) => {
//   try {
//     const playerId = req.params.id;
//     const career = await fetchPlayerCareer(playerId);
//     res.json(career);
//   } catch (error) {
//     res.status(500).json({ error: `Failed to fetch career data for player ${playerId}` });
//   }
// });

// app.get('/api/player/:id/bowling', async (req, res) => {
//   try {
//     const playerId = req.params.id;
//     const bowling = await fetchPlayerBowling(playerId);
//     res.json(bowling);
//   } catch (error) {
//     res.status(500).json({ error: `Failed to fetch bowling data for player ${playerId}` });
//   }
// });

// app.get('/api/player/:id/batting', async (req, res) => {
//   try {
//     const playerId = req.params.id;
//     const batting = await fetchPlayerBatting(playerId);
//     res.json(batting);
//   } catch (error) {
//     res.status(500).json({ error: `Failed to fetch batting data for player ${playerId}` });
//   }
// });

const rapidAPIKey = '1a36a54c9bmsh57ab6e766a31f11p1c7e41jsn0dfc9ce78bb5';
const rapidAPIHost = 'cricbuzz-cricket.p.rapidapi.com';

const fetchTrendingPlayers = async () => {
  const options = {
    method: 'GET',
    url: `https://${rapidAPIHost}/stats/v1/player/trending`,
    headers: {
      'x-rapidapi-key': rapidAPIKey,
      'x-rapidapi-host': rapidAPIHost
    }
  };
  const response = await axios.request(options);
  return response.data.player;
};

const fetchPlayerCareer = async (playerId) => {
  const options = {
    method: 'GET',
    url: `https://${rapidAPIHost}/stats/v1/player/${playerId}/career`,
    headers: {
      'x-rapidapi-key': rapidAPIKey,
      'x-rapidapi-host': rapidAPIHost
    }
  };
  const response = await axios.request(options);
  return response.data.values;
};

const fetchPlayerBowling = async (playerId) => {
  const options = {
    method: 'GET',
    url: `https://${rapidAPIHost}/stats/v1/player/${playerId}/bowling`,
    headers: {
      'x-rapidapi-key': rapidAPIKey,
      'x-rapidapi-host': rapidAPIHost
    }
  };
  const response = await axios.request(options);
  return response.data.values;
};

const fetchPlayerBatting = async (playerId) => {
  const options = {
    method: 'GET',
    url: `https://${rapidAPIHost}/stats/v1/player/${playerId}/batting`,
    headers: {
      'x-rapidapi-key': rapidAPIKey,
      'x-rapidapi-host': rapidAPIHost
    }
  };
  const response = await axios.request(options);
  return response.data.values;
};

app.get('/api/trending-players', async (req, res) => {
  try {
    const players = await fetchTrendingPlayers();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending players' });
  }
});

app.get('/api/player/:id/career', async (req, res) => {
  try {
    const playerId = req.params.id;
    const career = await fetchPlayerCareer(playerId);
    res.json(career);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch career data for player ${playerId}` });
  }
});

app.get('/api/player/:id/bowling', async (req, res) => {
  try {
    const playerId = req.params.id;
    const bowling = await fetchPlayerBowling(playerId);
    res.json(bowling);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch bowling data for player ${playerId}` });
  }
});

app.get('/api/player/:id/batting', async (req, res) => {
  try {
    const playerId = req.params.id;
    const batting = await fetchPlayerBatting(playerId);
    res.json(batting);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch batting data for player ${playerId}` });
  }
});

//----------------------------chatbot
ngrok_url='https://a7ab-34-16-199-212.ngrok-free.app/'

app.post('/ask', async (req, res) => {
  const { question } = req.body;

  try {
    // Simulate a request to the Flask API
    const response = await fetch(`${ngrok_url}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching the response:', error);
    res.status(500).json({ error: 'Error fetching the response' });
  }
});

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();
// const port = 5000;

// Middleware
// app.use(express.json());
// app.use(cors());

// Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/cricketChatbot", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const questionSchema = new mongoose.Schema({
//   question: String,
//   answer: String
// });

// const Question = mongoose.model('Question', questionSchema);

// // API Endpoint to get answer based on question
// app.get('/api/answer', async (req, res) => {
//   const questionText = req.query.question.toLowerCase();
//   const question = await Question.findOne({ question: { $regex: new RegExp(questionText, 'i') } });
//   if (question) {
//     res.json({ answer: question.answer });
//   } else {
//     res.json({ answer: "Sorry, I don't have an answer to that question." });
//   }
// });

// // Seed the database with initial questions and answers
// app.post('/api/seed', async (req, res) => {
//   const questions = req.body.questions;
//   await Question.deleteMany({});
//   await Question.insertMany(questions);
//   res.json({ message: 'Database seeded successfully!' });
// });


// const questions = require('./data');

// app.post('/api/seed', async (req, res) => {
//   await Question.deleteMany({});
//   await Question.insertMany(questions);
//   res.json({ message: 'Database seeded successfully!' });
// });
const fs = require('fs');

// Load the Q&A data from a JSON file
const qaData = JSON.parse(fs.readFileSync('cric.json', 'utf8')).questions;

// Endpoint to get the answer based on the question
app.post('/', (req, res) => {
  const { question } = req.body;
  const lowerCaseQuestion = question.toLowerCase();
  
  // Find the answer from the JSON data
  const match = qaData.find(item => item.question.toLowerCase() === lowerCaseQuestion);
  
  if (match) {
    res.json({ answer: match.answer });
  } else {
    res.json({ answer: "Sorry, I don't know the answer to that question." });
  }
});

app.use(express.static('public'));

// Route to fetch JSON data
app.get('/data', (req, res) => {
  res.sendFile(__dirname + '/public/data.json');
});

app.listen(3000,()=>{
    console.log("port connected");
})

//3000