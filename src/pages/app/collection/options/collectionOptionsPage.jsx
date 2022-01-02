import React from "react";
import WorkspaceNav from "../../../../components/workspaceNav/workspaceNav";
import Button from "../../../../components/common/button/button";
import Spinner from "../../../../components/common/spinner/spinner";
import Input from "../../../../components/common/input/input";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import {
  getCollectionNoPopulate,
  deleteCollection,
  editCollection,
} from "../../../../services/api/collectionsService";
import ConfirmDialog from "../../../../components/common/confirmDialog/confirmDialog";
import "./collectionOptionsPage.css";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

// TODO: implement ViewCollectionPage
class CollectionOptionsPage extends React.Component {
  state = {
    loading: true,
    collection: {},
    redirect: undefined,
    titleEditActive: false,
    editFieldsValues: {},
  };

  componentDidMount() {
    getCollectionNoPopulate(this.props.match.params.id).then(({ data }) =>
      this.setState({ collection: data, loading: false })
    );
  }

  handleDeleteCollection = () => {
    deleteCollection(this.props.match.params.id).then(({ data }) =>
      ConfirmDialog({
        title: "Delete collection",
        message: `Are you sure you want to delete ${this.state.collection.title}?`,
        labelConfirm: "Delete",
        labelDismiss: "Cancel",
        onConfirm: () =>
          deleteCollection(this.props.match.params.id, data._id).then(() => {
            toast.warning("Collection deleted.");
            this.setState({ redirect: "/app/dashboard" });
          }),
      })
    );
  };

  render() {
    const { collection, titleEditActive } = this.state;
    return (
      <div className="view collection-options">
        <WorkspaceNav collectionId={this.props.match.params.id} />
        {this.state.loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <div className="collection-options-content-div">
              <h2>General</h2>
              {!titleEditActive ? (
                <div>
                  <p>
                    <b>Title:</b> {collection.title}
                  </p>
                  <EditOutlinedIcon
                    className="collection-options-edit-button c-def"
                    onClick={() =>
                      this.setState({
                        titleEditActive: true,
                        editFieldsValues: { title: collection.title },
                      })
                    }
                  />
                </div>
              ) : (
                <div>
                  <p>
                    <b>Title:</b>
                  </p>
                  <Input
                    value={this.state.editFieldsValues["title"]}
                    outlined
                    onChange={(e) => {
                      let val = this.state.editFieldsValues;
                      val.title = e.target.value;
                      this.setState({ editFieldsValues: val });
                    }}
                  />
                  <CancelOutlinedIcon
                    className="collection-options-edit-button c-warning"
                    onClick={() => this.setState({ titleEditActive: false })}
                  />
                  <CheckOutlinedIcon
                    className="collection-options-edit-button c-success"
                    onClick={() => {
                      editCollection(
                        collection._id,
                        this.state.editFieldsValues
                      ).then(() => {
                        toast.success("Collection updated.");
                        this.setState({
                          titleEditActive: false,
                          loading: true,
                        });
                        getCollectionNoPopulate(
                          this.props.match.params.id
                        ).then(({ data }) =>
                          this.setState({ collection: data, loading: false })
                        );
                      });
                    }}
                  />
                </div>
              )}
              <div>
                <Button
                  text="Delete collection"
                  onClick={this.handleDeleteCollection}
                />
              </div>
            </div>
            <div className="collection-options-content-div">
              <h2>Export</h2>
              <div>
                <Button style={{ margin: "10px" }} text="Export to Excel" />
                <Button style={{ margin: "10px" }} text="Export as JSON" />
                <Button style={{ margin: "10px" }} text="Export as XML" />
              </div>
            </div>
          </React.Fragment>
        )}
        {this.state.redirect && <Redirect to={this.state.redirect} />}
      </div>
    );
  }
}

export default CollectionOptionsPage;