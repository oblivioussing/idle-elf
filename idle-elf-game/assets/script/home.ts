import { _decorator, Color, Component, director, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("home")
export class home extends Component {
  start() {
    const labelNode = new Node("Label");
    const label = labelNode.addComponent(Label);
    label.name = "test";
    label.string = "layout";
    label.color = Color.RED;
    label.fontSize = 40;
    this.node.addChild(labelNode);

    const labelNode1 = new Node("Label1");
    const label1 = labelNode1.addComponent(Label);
    label1.name = "test";
    label1.string = "layout1";
    label1.color = Color.RED;
    label1.fontSize = 40;
    this.node.addChild(labelNode1);
  }

  update(deltaTime: number) {}
}
