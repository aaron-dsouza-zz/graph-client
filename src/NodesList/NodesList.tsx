import React, { Component } from "react";

interface Node {
  id: String;
  label: String;
}

interface NodesListProps {
  //
}

interface NodesListState {
  nodes: Array<Node>;
  isLoading: boolean;
}

class NodesList extends Component<NodesListProps, NodesListState> {
  constructor(props: NodesListProps) {
    super(props);

    this.state = {
      nodes: [],
      isLoading: false
    };
  }
  async componentDidMount() {
    this.setState({isLoading: true});

    // const response = await fetch('http://localhost:3000/nodes');
    // console.log(response);
    // const data = await response.json();
    // this.setState({nodes: data, isLoading: false});
    const eventSource = new EventSource('http://localhost:3000/nodes/stream');
    eventSource.onopen = (event: any) => console.log('open', event);
    eventSource.onmessage = (event: any) => {
      this.setState({isLoading: true});
      // console.log(event);
      const node = JSON.parse(event.data);
      console.log(node);
      this.state.nodes.push(node);
      this.setState({nodes: this.state.nodes, isLoading: false});
    };
    eventSource.onerror = (event: any) => {
        console.log('error', event);
        eventSource.close();
    };
  }

  render() {
    const {nodes, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <h2>Nodes</h2>
        {nodes.map((node: Node) =>
          <div key={node.id.toString()}>
              {node.id}:{node.label}<br/>
          </div>
        )}
      </div>
    );
  }
}

export default NodesList;
