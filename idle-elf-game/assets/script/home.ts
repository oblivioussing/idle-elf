import { _decorator, Color, Component, director, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("home")
export class home extends Component {
  start() {
    const labelNode = new Node("Label");
    const label = labelNode.addComponent(Label);
    label.name = "test";
    label.string = "New Label";
    label.color = Color.RED;
    label.fontSize = 40;
    this.node.addChild(labelNode);
  }

  update(deltaTime: number) {}
}
