import { _decorator, Color, Component, director, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("home")
export class home extends Component {
  start() {
    for (let i = 0; i < 5; i++) {
      const labelNode = new Node("Label" + i);
      const label = labelNode.addComponent(Label);
      label.name = "test" + i;
      label.string = "layout" + i;
      label.color = Color.RED;
      label.fontSize = 40;
      this.node.addChild(labelNode);
    }
  }

  update(deltaTime: number) {}
}
