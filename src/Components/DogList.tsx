import React from 'react';

export default class DogList extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      breeds: {},
      selected_breed: '',
      selected_sub_breed: '',
      number_of_images_requested:10,
      fetching_breeds:true,
      image_urls:[]
    };
  }

  componentDidMount() {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(response => response.json())
      .then(data => {
        this.setState({ breeds:  data.message});
        this.setState({fetching_breeds: false});
      });

  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === 'selected_breed'){
      this.setState({ selected_sub_breed: '' });
    }
  }

  handleSubmit(event) {
    fetch('https://dog.ceo/api/breed/' + this.state.selected_breed + '/'+ 
      ( this.state.selected_sub_breed ? this.state.selected_sub_breed +'/':'') +
       'images/random/' + this.state.number_of_images_requested)
      .then(response => response.json())
      .then(data => {
        this.setState({ image_urls:  data.message});
        this.setState({fetching_breeds: false});
      });
    event.preventDefault();
  }

  render() {
    return (
      <div id="layout-content" className="layout-content-wrapper">
        <form onSubmit={this.handleSubmit}>
            <div class='md-3'>
              <p>Breed</p>
              <select onChange={this.handleChange} name='selected_breed' required='required'>
              <option value=''>Select</option>
              {!this.state.fetching_breeds ?
                Object.keys(this.state.breeds).map(( breed_name) => {
                  return (<option value={breed_name} selected={this.state.selected_breed === breed_name} >{breed_name}</option>);
                }) 
                :
                <optgroup label='Loading'></optgroup>
              }
              </select>
            </div>

            { (!this.state.fetching_breeds && this.state.selected_breed !== '' && this.state.breeds[this.state.selected_breed].length > 0) &&
              <div class='md-3'>
                <p>Sub Breed</p>
                <select onChange={this.handleChange} name='selected_sub_breed'>
              <option value=''>Select</option>
                {
                  this.state.breeds[this.state.selected_breed].map(( sub_breed_name) => {
                    return (<option value={sub_breed_name} selected={this.state.selected_breed === sub_breed_name} >{sub_breed_name}</option>);
                  })
                }
                </select>
              </div>
            }

            <div class='md-3'>
              <p>Number of images</p>
              <input type='number' name='number_of_images_requested' onChange={this.handleChange}  min='1' step='1' defaultValue='10'/>
            </div>
            <input type="submit" value="View Images" />
        </form>
        <div>
        {
          this.state.image_urls.length > 0 && 
          this.state.image_urls.map((image_url) => {
            return (
              <a href={image_url}>
                <img src={image_url} class='dog_image'/>
              </a>
              );
          })
        }
        </div>
      </div>
    );
  }
}