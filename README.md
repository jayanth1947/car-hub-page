## Car Hub Project

  The Car Hub project is a web application developed using Lightning Web Components (LWC) in Salesforce. The application allows users to view and filter a list of cars, and view the details of individual cars. It also allows users to add new cars to the list.

## Components
The Car Hub application consists of several components:

- Car List component: displays a list of cars and allows users to filter the list based on make, model, and year.
- Car Details component: displays the details of a selected car, including its make, model, year, and price.
- Car Filter component: allows users to filter the car list based on make, model, and year.
- Car Form component: allows users to add new cars to the list.
    These components communicate with each other using message channels and events. For example, when a user selects a car in the Car List component, it sends a message to the Car Details component to display the details of the selected car.

## Apex Classes
- The project also uses Apex classes to interact with the Salesforce database and retrieve and update car records. The Apex classes handle the data retrieval and storage, allowing the Lightning components to focus on the user interface.

## Installation
-To use the Car Hub project, you'll need a Salesforce Developer org. If you don't have one, sign up for a free account on the Salesforce Developer website.

To install the Car Hub project, follow these steps:

- Download or clone the project to your computer.
- Authenticate with your Salesforce org using the Salesforce CLI command: sfdx force:auth:web.
- Create a scratch org using the command: sfdx force:org:create -f config/project-scratch-def.json.
- Push the source code to your org using the command: sfdx force:source:push.
- Assign the CarHub permission set to your user using the command: sfdx force:user:permset:assign -n CarHub.
- Open your org in a browser and navigate to the Car Hub app.

## Contributing
We welcome contributions from the community. If you are interested in contributing, please fork our repository and submit a pull request. We will review your code and merge it if it meets our standards.



