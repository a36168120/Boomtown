import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import { Menu, MenuItem, Button, IconButton } from "@material-ui/core";
import logo from "../../images/boomtown.svg";
import { Link, withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import client from "../../apollo";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { LOGOUT_MUTATION } from "../../apollo/queries";
import LogoutIcon from "@material-ui/icons/PowerSettingsNew";
import ProfileIcon from "@material-ui/icons/Fingerprint";

const ITEM_HEIGHT = 48;

const MenuBar = ({ classes, location }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <Mutation
        mutation={LOGOUT_MUTATION}
        onCompleted={() => client.resetStore()}
      >
        {logout => (
          <div className={classes.bar}>
            <Link to="/items">
              <img src={logo} alt="BoomTown Logo" className={classes.logo} />
            </Link>
            <div>
              <Link to="/share">
                {location.pathname !== "/share" && (
                  <Button>
                    <AddCircleIcon
                      color="action"
                      fontSize="large"
                      className={classes.shareButton}
                    />
                    SHARE SOMETHING
                  </Button>
                )}
              </Link>

              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                className={classes.button}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: 200
                  }
                }}
              >
                <MenuItem onClick={logout}>
                  <Link to="/profile">
                    <span>
                      <ProfileIcon />
                      Your Profile
                    </span>
                  </Link>
                </MenuItem>

                <MenuItem onClick={logout}>
                  <Link to="/welcome">
                    <span>
                      <LogoutIcon />
                      Sign out
                    </span>
                  </Link>
                </MenuItem>
              </Menu>
            </div>
          </div>
        )}
      </Mutation>
    </div>
  );
};

export default withRouter(withStyles(styles)(MenuBar));
