import React, { Component, PropTypes } from "react";
import { Meteor } from "meteor/meteor";
import { i18next } from "/client/api";
import { composeWithTracker } from "/lib/api/compose";
import MessagesContainer from "./messagesContainer";
import { Forgot } from "../components";

class ForgotContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formMessages: props.formMessages
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.formMessages = this.formMessages.bind(this);
    this.hasError = this.hasError.bind(this);
  }

  handleFormSubmit = (event, email) => {
    event.preventDefault();
    const emailAddress = email.trim();
    const validatedEmail = LoginFormValidation.email(emailAddress);
    const errors = {};

    if (validatedEmail !== true) {
      errors.email = validatedEmail;
    }

    if ($.isEmptyObject(errors) === false) {
      this.setState({
        formMessages: {
          errors: errors
        }
      });
      return;
    }

    Meteor.call("accounts/sendResetPasswordEmail", { email: emailAddress }, (error) => {
      // Show some message confirming result
      if (error) {
        this.setState({
          formMessages: {
            alerts: [error]
          }
        });
      } else {
        this.setState({
          formMessages: {
            info: [{
              reason: i18next.t("accountsUI.info.passwordResetSend") || "Password reset mail sent."
            }]
          }
        });
      }
    });
  }

  formMessages = () => {
    return (
      <MessagesContainer
        messages={this.state.formMessages}
      />
    );
  }

  hasError = (error) => {
    // True here means the field is valid
    // We're checking if theres some other message to display
    if (error !== true && typeof error !== "undefined") {
      return true;
    }

    return false;
  }

  render() {
    return (
      <Forgot
        {...this.props}
        onFormSubmit={this.handleFormSubmit}
        loginFormMessages={this.formMessages}
        messages={this.state.formMessages}
        onError={this.hasError}
      />
    );
  }
}

function composer(props, onData) {
  const formMessages = {};

  onData(null, {
    formMessages
  });
}

ForgotContainer.propTypes = {
  formMessages: PropTypes.object
};

export default composeWithTracker(composer)(ForgotContainer);
