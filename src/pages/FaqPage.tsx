// Core
import React, { FunctionComponent, Fragment } from 'react';
// Styles
import './FaqPage.scss';
// Components
import MobileHeader from '../layout/MobileHeader';
import PageBody from '../layout/PageBody';

// Component
const FaqPage: FunctionComponent = () => {
  return (
    <Fragment>
      <MobileHeader>
        <h1>FAQ</h1>
      </MobileHeader>
      <PageBody>
        <div id="FaqPage">
          <h2>What is the Oklahoma Summer Meals Program?</h2>
          <p>
            The Oklahoma Summer Meals Program is administered by the Oklahoma State Department of
            Education. While school is out for the summer, over 100 sponsoring organizations,
            serving hundreds of sites across the state, provide no-cost meals to kids 18 and
            younger. Many sites serve both breakfast and lunch or lunch and a snack.
          </p>
          <ul>
            <li>Any child can receive a meal.</li>
            <li>Meals must be eaten on site.</li>
            <li>No ID is necessary to participate.</li>
            <li>Children do not need to be accompanied.</li>
          </ul>
          <br />

          <h2>How do I find a site near me?</h2>
          <ul>
            <li>
              Clicking the “Find Food” button in the top right-hand corner of your screen will show
              a map of the nearest sites near your current location. Please allow to site to obtain
              your location to sort sites closest to you!
            </li>
            <li>
              Use the search bar located at the top of the page to look for a site near a different
              location.
            </li>
            <li>
              Go to 'Full Directory' to search through complete list of available site locations.
            </li>
            <li>Select the “Get Directions” button for Google Map directions to the site.</li>
          </ul>
          <br />

          <h2>About this website:</h2>
          <p>
            This map was created in partnership with Code for Tulsa, Hunger Free Oklahoma, and the
            Oklahoma State Department of Education to help families locate summer meal sites faster
            than ever before. For questions about this program or help finding a meal site, call
            Hunger Free Oklahoma at (918)591-2460.
          </p>
          <br />
          <h3>About the partners: </h3>
          <img alt="code for tulsa logo" src="assets/codefortulsa.png" />
          <p>
            Code for Tulsa is among about 70 Code for America “brigades” nationwide that help code
            and data specialist bring their technology skills to the process of connecting people to
            their local governments. The Tulsa brigade was one of the earliest to organize as the
            Code for America ideas expanded starting in 2009.
          </p>
          <img alt="Hunger Free Oklahoma logo" src="assets/hungerfreelogo.svg" />
          <p>
            Hunger Free Oklahoma works to bring a unified, statewide voice to the issues and
            solutions surrounding hunger, with a goal to ensure all Oklahomans have access to
            affordable, nutritious food. We are leveraging the power of collaboration to solve
            hunger in Oklahoma by improving systems, policies, and practices.
          </p>
          <img alt="Oklahoma State Department of Education logo" src="assets/okdeptedu.svg" />
          <p>
            The Oklahoma State Department of Education is charged with determining the policies and
            directing the administration and supervision of the public school system of Oklahoma.
            This includes administering the summer meals program, school breakfast and lunch
            programs, and afterschool meal programs.
          </p>
        </div>
      </PageBody>
    </Fragment>
  );
};

// Export
export default FaqPage;
