import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSpeaker } from 'appRedux/modules/speaker';
import Grid from 'material-ui/Grid';

// App
import SpeakerCard from './components/SpeakerCard';
import SpeakerInfo from './components/SpeakerInfo';
import FeaturedTalks from './components/FeaturedTalks';
import MessageSpeakerForm from './components/MessageSpeakerForm';
import Banner from 'appCommon/Banner';

const Speaker = props => {
  const { speaker, talks } = props;
  return (
    <Grid container justify="center">
      <Grid item xs={12}>
        <Banner />
      </Grid>
      <Grid item xs={8}>
        <Grid container>
          <Grid item xs={12} md={4}>
            <SpeakerCard speaker={speaker} />
          </Grid>
          <Grid item xs={12} md={8}>
            <SpeakerInfo speaker={speaker} />
            <MessageSpeakerForm speaker={speaker} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

class SpeakerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.props.getSpeaker(id);
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id: currentId } } } = this.props;
    const { match: { params: { id: nextId } } } = nextProps;
    if (!!nextId && nextId !== currentId) {
      this.props.getSpeaker(nextId);
    }
  }

  render() {
    return this.props.speaker ? (
      <Speaker speaker={this.props.speaker} talks={this.props.featuredTalks} />
    ) : (
      <div>Loading...</div>
    );
  }
}

const mockFeaturedTalks = [
  {
    id: 1,
    name: "Building Products That Don't Suck",
    organization: 'TechToronto',
    url: 'https://google.ca',
    image: 'http://via.placeholder.com/250x250',
  },
  {
    id: 2,
    name: 'Today: Shopify Merchants and Consumers',
    organization: 'Shopify Partners',
    url: 'https://google.ca',
    image: 'http://via.placeholder.com/350x250',
  },
  {
    id: 3,
    name: 'Third One',
    organization: 'Some Company',
    url: 'https://google.ca',
    image: 'http://via.placeholder.com/250x350',
  },
];

function mapStateToProps(state) {
  return {
    speaker: state.speaker.speaker,
    featuredTalks: mockFeaturedTalks, // state.featuredTalks,
    notification: state.notification.message,
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getSpeaker: id => {
      dispatch(getSpeaker(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SpeakerContainer);
