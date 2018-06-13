// NPM
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { find } from 'lodash';

// APP
import SpeakerList from './components/SpeakerList';
import Filters from './components/Filters';
import MobileFilters from './components/MobileFilters';
import MobileSearch from './components/MobileSearch';
import StyledButton from 'appCommon/StyledButton';
import Banner from 'appCommon/Banner';
import { fetchSpeakers, updateSearchParams } from 'appRedux/modules/speaker';
import { get as getLocations } from 'appRedux/modules/location';
import { get as getUser } from 'appRedux/modules/user';
import { DEFAULT_SPEAKER_LIMIT } from 'appHelpers/constants';

import css from './styles.css';

const searchParamsToSpeakerIdentity = ({ poc, woman }) => {
  if (!poc && !woman) {
    return 'All speakers';
  } else {
    const genderIdentityString = woman ? 'Women' : 'People';
    const pocIdentityString = poc ? 'of color' : '';
    return `${genderIdentityString} ${pocIdentityString}`;
  }
};

const Home = ({
  searchParams,
  locations,
  speakers,
  endOfResults,
  loadMoreSpeakers,
}) => {
  const searchQuery = searchParams.q ? `'${searchParams.q}'` : 'all topics';
  const locationObj = find(locations, { id: parseInt(searchParams.location) })
  const location = locationObj
    ? locationObj.city
    : 'all cities';
  const speakerIdentity = searchParamsToSpeakerIdentity(searchParams);

  return (
    <Grid container justify="center" spacing={0}>
      <Grid item xs={12}>
        <Banner />
      </Grid>
      <Grid item xs={12} md={9}>
        <Grid container spacing={0}>
          <Grid item md={3} hidden={{ smDown: true }} className={css.filtersContainer}>
            <Filters locations={locations} selectedLocation={locationObj} />
          </Grid>
          <Grid item xs={12} hidden={{ mdUp: true }}>
            <MobileSearch />
            <MobileFilters locations={locations} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <div className={css.contentTitles}>
                  {`${speakerIdentity} in ${location} for ${searchQuery}`}
                </div>
              </Grid>
            </Grid>
            <SpeakerList
              speakers={speakers}
              endOfResults={endOfResults}
              loadMoreSpeakers={loadMoreSpeakers}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.getLocations({ active: true });
    this.props.fetchSpeakers(this.props.searchParams);
  }

  componentWillMount() {
    console.log('this.props.user', this.props.user)
    if (!this.props.user.id) {
      console.log('getting user')
      this.props.getUser();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchParams != nextProps.searchParams) {
      this.props.fetchSpeakers(nextProps.searchParams);
    }
  }

  loadMoreSpeakers = () => {
    this.props.updateSearchParams({
      limit: DEFAULT_SPEAKER_LIMIT,
      offset: this.props.searchParams.offset + DEFAULT_SPEAKER_LIMIT,
      append: true,
    });
  };

  render() {
    return <Home loadMoreSpeakers={this.loadMoreSpeakers} {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    speakers: state.speaker.results,
    locations: state.location.locations,
    searchParams: state.speaker.searchParams,
    endOfResults: state.speaker.endOfResults,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSpeakers: params => {
      dispatch(fetchSpeakers(params));
    },
    updateSearchParams: params => {
      dispatch(updateSearchParams(params));
    },
    getUser: () => {
      dispatch(getUser());
    },
    getLocations: (opts) => {
      dispatch(getLocations(opts));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
