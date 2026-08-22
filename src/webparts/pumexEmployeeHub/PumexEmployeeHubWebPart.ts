import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyPaneTextField, PropertyPaneDropdown } from '@microsoft/sp-property-pane';

import { PumexEmployeeHub, IPumexEmployeeHubProps } from '../../components/PumexEmployeeHub/PumexEmployeeHub';

export interface IPumexEmployeeHubWebPartProps {
  title: string;
  selectedDepartment: string;
  displayMode: string;
}

export default class PumexEmployeeHubWebPart extends BaseClientSideWebPart<IPumexEmployeeHubWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPumexEmployeeHubProps> = React.createElement(
      PumexEmployeeHub,
      {
        title: this.properties.title,
        selectedDepartment: this.properties.selectedDepartment,
        displayMode: this.properties.displayMode,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration() {
    return {
      pages: [
        {
          header: { description: "Configure Pumex Employee Hub Web Part" },
          groups: [
            {
              groupName: "Hub Settings",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: "Hub Title"
                }),
                PropertyPaneDropdown('selectedDepartment', {
                  label: "Default Department Filter",
                  options: [
                    { key: 'All', text: 'All Departments' },
                    { key: 'Engineering', text: 'Engineering' },
                    { key: 'Design', text: 'Design' },
                    { key: 'Human Resources', text: 'Human Resources' },
                    { key: 'Marketing', text: 'Marketing' },
                    { key: 'Operations', text: 'Operations' }
                  ]
                }),
                PropertyPaneDropdown('displayMode', {
                  label: "Initial View Mode",
                  options: [
                    { key: 'split', text: 'Split View (Directory + Announcements)' },
                    { key: 'directory', text: 'Directory Only' },
                    { key: 'announcements', text: 'Announcements Only' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
