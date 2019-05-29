import React from 'react';
import pushek from './puszek.gif';
import './App.css';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


firebase.initializeApp({
  apiKey: 'API_KEY',
  authDomain: 'AUTH_DOMAIN',
  projectId: 'PROJECT_ID'
});

var db = firebase.firestore();

class App extends React.Component {


  loadDevices() {
    db.collection("devices").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data().name}`);
      });
  });
  }

  render() {
    return <List>
      <ListItem button>
        <ListItemText primary="Item 1"></ListItemText>
      </ListItem>
      <Button variant="contained" color="primary" onClick={this.loadDevices} >Hello Johannes!</Button>
    </List>
  }
}

// const App: React.FC = () => {
//   return (
//     <Button variant="contained" color="primary">
//     Hello
//       </Button>
//   );
// }

export default App;
