import { makeStyles } from "@material-ui/core/styles";
import { Box, Button } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { useState, useEffect } from "react";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  messagesButton: {
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
  },
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user } = props;
  const conversation = props.conversation || {};
  const allMessages = conversation.messages;
  const [convoMessages, setConvoMessages] = useState([]);
  const [seeAllMessages, setSeeAllMessages] = useState(false);

  useEffect(() => {
    if (conversation.latestMessageId) {
      let initialMessages = allMessages.slice(-6);
      setConvoMessages(initialMessages);
      setSeeAllMessages(false);
    }
  }, [conversation.latestMessageId, allMessages])

  const handleClick = () => {
    setConvoMessages(allMessages);
    setSeeAllMessages(true);
  };

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            {!seeAllMessages && (
              <Button className={classes.messagesButton} onClick={handleClick}>
                Load All Messages
              </Button>
            )}
            <Messages
              messages={convoMessages}
              otherUser={conversation.otherUser}
              userId={user.id}
              latestMessageId={conversation.latestMessageId}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) =>
          conversation.otherUser.username === state.activeConversation
      ),
  };
};

export default connect(mapStateToProps, null)(ActiveChat);
