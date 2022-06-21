import React from 'react';
import { Form, Button } from "react-bootstrap";

type DogListState = {
  breeds: IHash;
  selected_breed: string
  selected_sub_breed: string;
  number_of_images_requested: int;
  fetching_breeds: boolean;
  image_urls: array;
};

export default class DogList extends React.Component<{}, DogListState> {
  state: DogListState = {
    breeds: {},
    selected_breed: '',
    selected_sub_breed: '',
    number_of_images_requested:10,
    fetching_breeds:true,
    image_urls:[]
  };
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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
          <div className="row align-items-center">
            <div className='col-sm'>
              <p className="text-left">Breed</p>
              <Form.Select id='breed_select' onChange={this.handleChange} name='selected_breed' required='required' defaultValue={this.state.selected_breed} isInvalid={!(this.state.selected_breed)} >
              <option value=''>Select</option>
              {!this.state.fetching_breeds ?
                Object.keys(this.state.breeds).map(( breed_name) => {
                  return (<option key={breed_name} value={breed_name}>{breed_name}</option>);
                }) 
                :
                <optgroup label='Loading'></optgroup>
              }
              </Form.Select>
            </div>

            { (!this.state.fetching_breeds && this.state.selected_breed !== '' && this.state.breeds[this.state.selected_breed].length > 0) &&
              <div className='col-sm'>
                <p className="text-left">Sub Breed</p>
                <Form.Select id='sub_breed_select' onChange={this.handleChange} name='selected_sub_breed' defaultValue={this.state.selected_sub_breed} >
                  <option value=''>Select</option>
                {
                  this.state.breeds[this.state.selected_breed].map(( sub_breed_name) => {
                    return (<option key={sub_breed_name} value={sub_breed_name} >{sub_breed_name}</option>);
                  })
                }
                </Form.Select>
              </div>
            }

            <div className='col-sm'>
              <p className="text-left">Number of images</p>
              <Form.Control id='number_of_images_requested' type='number' name='number_of_images_requested' onChange={this.handleChange}
                min='1' step='1' defaultValue='10' isInvalid={!(this.state.number_of_images_requested > 0)} required />
            </div>
            <div className='col-sm'>
              <Button id='submit_image_search' variant="primary" type="submit">
                View Images
              </Button>
            </div>
          </div>
        </form>
        <div className="row" >
        {
          this.state.image_urls.length > 0 && 
          this.state.image_urls.map((image_url) => {
            return (
            <div className='col-sm'> 
              <a href={image_url}>
                <img src={image_url} className='dog_image' alt="A dog from dog.ceo"/>
              </a>
              </div>
              );
          })
        }
        </div>
      </div>
    );
  }
}