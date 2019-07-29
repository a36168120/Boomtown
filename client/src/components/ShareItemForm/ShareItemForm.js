import React, { Component } from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { Form, Field, FormSpy } from "react-final-form";
import { connect } from "react-redux";

import {
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Checkbox,
  ListItemText
} from "@material-ui/core";

import {
  updateItems,
  resetItems,
  resetItemImage
} from "../../redux/ShareItemPreview/reducer";
import { ViewerContext } from "../../context/ViewerProvider";

import { ADD_ITEM_MUTATION } from "../../apollo/queries";
import { Mutation } from "react-apollo";

class ShareItemForm extends Component {
  constructor({ props }) {
    super(props);
    this.state = {
      fileSelected: false,
      done: false,
      selectedTags: []
    };
    this.fileInput = React.createRef();
  }

  onSubmit(formState) {
    console.log(formState);
  }

  validate(formState) {
    console.log("validating");
  }

  /* converting the image into a string (base64) */
  getBase64Url() {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(
          `data:${this.state.fileSelected.type};base64, ${btoa(
            e.target.result
          )}`
        );
      };
      reader.readAsBinaryString(this.state.fileSelected);
    });
  }

  /* picks select tags from the dropdown menu */
  applyTags(tags) {
    return (
      tags &&
      tags
        .filter(t => this.state.selectedTags.indexOf(t.id) > -1)
        .map(t => ({ title: t.title, id: t.id }))
    );
  }

  /* calls the prop to update the value */
  dispatchUpdate(values, tags, updateItems) {
    if (!values.imageurl && this.state.fileSelected) {
      this.getBase64Url().then(imageurl => {
        updateItems({
          imageurl
        });
      });
    }
    updateItems({
      ...values,
      tags: this.applyTags(tags)
    });
  }

  generateTagsText(tags, selected) {
    return tags
      .map(t => (selected.indexOf(t.id) > -1 ? t.title : false))
      .filter(e => e)
      .join(", ");
  }

  handleSelectTag(event) {
    this.setState({ selectedTags: event.target.value });
  }

  handleSelectFile(event) {
    this.setState({
      fileSelected: this.fileInput.current.files[0]
    });
  }

  resetFileInput() {
    this.props.resetItemImage();
    this.fileInput.current.value = "";
    this.setState({ fileSelected: false });
  }

  saveItem = async (values, tags, addItem) => {
    try {
      await addItem ({
        variables: {
          item: {
            ...values,
            tags: this.applyTags(tags)
          }
        }
      })
    }
    catch (e) {
      throw new Error (e)
    };
  }

  render() {
    const { tags, classes, updateItems } = this.props;
    return (
      <ViewerContext.Consumer>
        {({ viewer }) => (
          <div className={classes.container}>
            <Mutation mutation={ADD_ITEM_MUTATION}>
              {(addItem, { data }) => (
                <CardContent>
                  <Form
                    validate={formState => this.validate(formState)}
                    onSubmit={formState => this.onSubmit(formState)}
                    render={({ handleSubmit, pristine, invalid }) => (
                      <form onSubmit={handleSubmit}>
                        <FormSpy
                          subscription={{ values: true }}
                          component={({ values }) => {
                            if (values) {
                              this.dispatchUpdate(values, tags, updateItems);
                            }
                            return "";
                          }}
                        />

                        <h1 className={classes.header}>
                          {" "}
                          Share. Borrow. Prosper.
                        </h1>

                        <FormControl fullWidth className={classes.formControl}>
                          <Field name="imageurl">
                            {({ input, meta }) => {
                              return (
                                <React.Fragment>
                                  {!this.state.fileSelected ? (
                                    <Button
                                      className={classes.selectButton}
                                      size="medium"
                                      color="primary"
                                      variant="contained"
                                      onClick={() => {
                                        this.fileInput.current.click();
                                      }}
                                    >
                                      <h4 className={classes.imageText}>
                                        Select an Image
                                      </h4>
                                    </Button>
                                  ) : (
                                    <Button
                                      className={classes.selectButton}
                                      size="medium"
                                      color="primary"
                                      variant="outlined"
                                      onClick={() => {
                                        this.resetFileInput();
                                      }}
                                    >
                                      <h4>Reset image</h4>
                                    </Button>
                                  )}
                                  <input
                                    ref={this.fileInput}
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    id="fileInput"
                                    onChange={e => this.handleSelectFile(e)}
                                  />
                                </React.Fragment>
                              );
                            }}
                          </Field>
                        </FormControl>

                        <div>
                          <Field
                            name="title"
                            render={({ input, meta }) => (
                              <label>
                                <TextField
                                  id="title"
                                  inputProps={{ ...input }}
                                  label="Name your Item"
                                  value={input.value}
                                  margin="normal"
                                  className={classes.inputfield}
                                />
                              </label>
                            )}
                          />
                        </div>

                        <div>
                          <Field
                            name="description"
                            render={({ input, meta }) => (
                              <label>
                                <TextField
                                  id="description"
                                  inputProps={{ ...input }}
                                  label="Describe your Item"
                                  value={input.value}
                                  margin="normal"
                                  className={classes.inputfield}
                                />
                              </label>
                            )}
                          />
                        </div>
                        <div>
                          <FormControl fullWidth>
                            <InputLabel htmlFor="age-simple">
                              Add some tags
                            </InputLabel>
                            <Field name="tags">
                              {({ input, meta }) => {
                                return (
                                  <Select
                                    multiple
                                    value={this.state.selectedTags}
                                    onChange={e => this.handleSelectTag(e)}
                                    renderValue={selected => {
                                      return this.generateTagsText(
                                        tags,
                                        selected
                                      );
                                    }}
                                  >
                                    {tags &&
                                      tags.map(tag => (
                                        <MenuItem key={tag.id} value={tag.id}>
                                          <Checkbox
                                            checked={
                                              this.state.selectedTags.indexOf(
                                                tag.id
                                              ) > -1
                                            }
                                          />
                                          <ListItemText primary={tag.title} />
                                        </MenuItem>
                                      ))}
                                  </Select>
                                );
                              }}
                            </Field>
                          </FormControl>
                        </div>
                        <Button
                          className={classes.shareButton}
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Share
                        </Button>
                      </form>
                    )}
                  />
                </CardContent>
              )}
            </Mutation>
          </div>
        )}
      </ViewerContext.Consumer>
    );
  }
}

/* converts dispatch functions into props */
const mapDispatchToProps = dispatch => ({
  updateItems(item) {
    dispatch(updateItems(item));
  },

  resetItems() {
    dispatch(resetItems);
  },

  resetItemImage() {
    dispatch(resetItemImage);
  }
});
export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(ShareItemForm));
