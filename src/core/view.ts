export default abstract class View {
  private template: string;
  private renderedTemplate: string;
  private container: HTMLElement;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const $container = document.getElementById(containerId);

    if (!$container) {
      throw "최상위 컨테이너가 없어 UI를 그릴 수 없습니다.";
    }

    this.container = $container;
    this.template = template;
    this.renderedTemplate = template;
    this.htmlList = [];
  }

  protected updateView(): void {
    this.container.innerHTML = this.renderedTemplate;
    this.renderedTemplate = this.template;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  protected getHtml(): string {
    const snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  }

  protected setTemplateData(key: string, value: string): void {
    this.renderedTemplate = this.renderedTemplate.replace(`{{__${key}__}}`, value);
  }

  private clearHtmlList(): void {
    this.htmlList = [];
  }

  abstract render(): void;
}
