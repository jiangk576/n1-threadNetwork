import {
  React,
  FocusedContactsStore,
  MessageStore,
  DatabaseStore,
  Message,
  FocusedContentStore,
} from 'mailspring-exports';
import electron from 'electron';

export default class MyMessageSidebar extends React.Component {
  static displayName = 'MyMessageSidebar';

  // This sidebar component listens to the FocusedContactStore,
  // which gives us access to the Contact object of the currently
  // selected person in the conversation. If you wanted to take
  // the contact and fetch your own data, you'd want to create
  // your own store, so the flow of data would be:

  // FocusedContactStore => Your Store => Your Component
  constructor(props) {
    super(props);
    this.state = this._getStateFromStores();
  }

  async _onMessageIdChange(messageId) {
    const query = DatabaseStore.findBy(Message, {
        headerMessageId: messageId
    });
    const message = await DatabaseStore.run(query);
    electron.remote.getCurrentWindow().setTitle(message.subject);
    //修改触发事件
    const focused = FocusedContentStore.focused('thread');
    let sel = null;
  }

  componentDidMount() {
    //this.unsubscribe = FocusedContactsStore.listen(this._onChange);
    let self = this;    //为了避免作用域及缓存
    window.receiveMessageFromIndex = function ( event ) {
        if(event!=undefined){
          self._onMessageIdChange(event.data);
          MessageStore._onMessageIdChange();
        }
    }
    //监听message事件
    window.addEventListener("message", receiveMessageFromIndex, false);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  _onChange = () => {
    this.setState(this._getStateFromStores());
  }

  _getStateFromStores = () => {
    return {
      contact: FocusedContactsStore.focusedContact(),
    };
  }

  _renderContent() {
    // Want to include images or other static assets in your components?
    // Reference them using the mailspring:// URL scheme:
    //
    // <RetinaImg
    //    url="mailspring://<<package.name>>/assets/checkmark_templatethis.2x.png"
    //    mode={RetinaImg.Mode.ContentIsMask}/>
    //
    return (
      <div className="header">
        <h1>{this.state.contact.displayName()} is the focused contact.</h1>
      </div>
    );
  }

  _renderPlaceholder() {
    return (
      <div> No Data Available </div>
    );
  }

  render() {
    const content = (this.state.contact) ? this._renderContent() : this._renderPlaceholder();
    const style = {
      width: '800px',
      height: '800px'
    }
    //return (
    //  <div>
    //    window.addEventListener('message',function(rs){'{'} 
    //    console.log(rs.data);
    //    {'}'})
    //    let iframeEle = document.createElement('iframe')
    //    iframeEle.src = 'http://localhost:8080/?jiangkun@w3.org'
    //    iframeEle.style = 'border: none;width: 700px;height: 700px;'
    //    document.body.insertBefore(iframeEle, document.body.firstChild)
    //  </div>
    //);
    return (
      <div id="neo4j" className="header">
        <iframe src = "http://localhost:8080/?jiangkun@w3.org" style={style} />
      </div>
    );
  }
}


// Providing container styles tells the app how to constrain
// the column your component is being rendered in. The min and
// max size of the column are chosen automatically based on
// these values.
MyMessageSidebar.containerStyles = {
  order: 2,
  flexShrink: 0,
};
