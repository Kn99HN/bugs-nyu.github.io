import React, { useState, useEffect } from "react";
import styled, {keyframes} from "styled-components";

const scalein = keyframes`
  from {
    transform: scale(0.9)
  },
  to {
    transform: scale(1)
  }
`;

const MainContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
`;

const PageContainer = styled.article`
  display: block;
`;

const MainDescriptionContainer = styled.section`
  margin-top: 10%;
  align-items: center;
  min-height: 100vh;
  padding-right: 15vw;
  padding-bottom: 5vw;
  padding-left: 15vw;
  display: flex;
  justify-items: stretch;
  align-items: baseline;
  margin-bottom: 5%;
  @media screen and (max-width: 1300px) {
    padding-bottom: 10vh;
    padding-top: 5vh;
    flex-direction: column;
    align-items: center;
  }
`;

const TableContainer = styled.div`
  height: 100vh;
  width: 30%;
  display: table;
  @media screen and (max-width: 1300px) {
    padding: 0px 5px 0px 5px;
    height: 20vh;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-weight: 400;
  font-style: normal;
  letter-spacing: 0em;
  text-transform: none;
  line-height: 1.2;
  font-size: calc(1vw + 1.5rem);
  color: rgba(255, 255, 255, 0.7);
  animation: ${scalein} 1s;
`;

const Name = styled.h4`
  font-weight: 300;
  font-style: normal;
  text-align: center;
  letter-spacing: 0em;
  text-transform: none;
  line-height: 0.5;
  font-size: calc(0vw + 1.2rem);
  color: white;
  cursor: pointer;
  &:hover {
    color: ${({ light }) => (light ? "purple" : "white")};
  }
`;

const TimelineContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 0px 100px;
  flex-direction: column;
  @media screen and (max-width: 1300px) {
    width: 100%;
    margin: 0px 0px 0px 0px;
  }
`;

const Timeline = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;

  &::after {
    content: "";
    position: absolute;
    width: 6px;
    background-color: white;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -3px;
  }

  @media screen and (max-width: 1300px) {
    &::after {
      left: 31px;
    }
  }
`;

const LeftContainer = styled.div`
  padding: 10px 40px;
  position: relative;
  background-color: inherit;
  width: 50%;
  left: -16%;

  &::after {
    content: "";
    position: absolute;
    width: 25px;
    height: 25px;
    right: -17px;
    background-color: white;
    border: ${({ light }) => (light ? "4px solid purple" : "4px solid #121212")};
    top: 15px;
    border-radius: 50%;
    z-index: 1;
  }

  @media screen and (max-width: 1300px) {
    width: 60%;
    padding-left: 70px;
    padding-right: 25px;
    left: 0%;
    
    &::after {
      left: 15px;
    }
  }

`;

const RightContainer = styled.div`
  padding: 10px 40px;
  position: relative;
  background-color: inherit;
  width: 50%;
  left: 50%;

  &::after {
    content: "";
    position: absolute;
    width: 25px;
    height: 25px;
    right: -17px;
    background-color: white;
    border: ${({ light }) => (light ? "4px solid purple" : "4px solid #121212")};
    top: 15px;
    border-radius: 50%;
    z-index: 1;
  }

  &::after {
    left: -16px;
  }

  @media screen and (max-width: 1300px) {
    width: 60%;
    padding-left: 70px;
    padding-right: 25px;
    left: 0%;
    
    &::after {
      left: 15px;
    }
  }
`;

const Time = styled.p`
  text-align: center;
  font-weight: 500;
  color: white;
  margin: 0;
  padding: 2px 0px 0px 0px;
`;

const ContentURL = styled.a`
  text-decoration: none;
`

const Content = styled.p`
  padding: 20px 30px;
  position: relative;
  border-radius: 6px;
  color: white;
  box-shadow: 0px 0px 0px 3px #121212;
  transition: all 0.2s linear;
  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ light }) => (light ? "0px 0px 0px 10px #57068c" : "0px 0px 0px 10px #330662")};
    color: ${({ light }) => (light ? "purple" : "")};
  }
`

const BoldText = styled.strong`
  color: white;
`;

const contributors = {
  "Ameya Shere": {},
  "Andy Huang": {},
  "Anupam Sushil": {},
  "Carol Long": {},
  "Santiago Darre": {},
  "Uriel Restrepo": {},
  "Yuchen Liu": {},
};

function parseDate(timestamp) {
  const date = new Date(timestamp);
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  const timestr = new Date(date.setSeconds(0, 0)).toLocaleTimeString();
  const times = timestr.split(" ");
  const hour = times[0];
  const minute = times[1];
  return `${month}/${day}/${year} ${hour}:${minute}`;
}

const ContributorsPage = (props) => {
  const [PRList, setPRList] = useState([]);
  const {theme} = props
  const light = theme === 'light'

  useEffect(() => {
    async function fetchData() {
      try {
        const webresp = await fetch(
          "https://api.github.com/repos/BUGS-NYU/bugs-nyu.github.io/pulls?state=closed"
        );
        const schedgeresp = await fetch(
          "https://api.github.com/repos/BUGS-NYU/schedge/pulls?state=closed"
        );
        const webJSON = await webresp.json();
        const schedgeJSON = await schedgeresp.json();
        const pullRequests = [];
        const takenUsers = {};
        //change this to be unique
        schedgeJSON.forEach((schedgePR) => {
          const createdTime = schedgePR.created_at;
          const url = schedgePR["html_url"];
          const user = schedgePR.user.login;
          if(!(`${user}-Schedge` in takenUsers)) {
            takenUsers[`${user}-Schedge`] = {}
            pullRequests.push({
              user: user,
              url: url,
              timestamp: parseDate(createdTime),
              name: "Schedge",
              text: `${user} made a Pull Request to Schedge!`,
            });
          }
        });

        webJSON.forEach((webPR) => {
          const createdTime = webPR.created_at;
          const url = webPR["html_url"];
          const user = webPR.user.login;
          if(!(`${user}-BUGSWebsite` in takenUsers)) {
            takenUsers[`${user}-BUGSWebsite`] = {}
            pullRequests.push({
              user: user,
              url: url,
              timestamp: parseDate(createdTime),
              name: "BUGS website",
              text: `${user} made a Pull Request to BUGS website!`,
            });
          }
        });
        const sortedPullRequests = pullRequests.sort((a, b) => {
          let dateA = new Date(a.timestamp);
          let dateB = new Date(b.timestamp);
          return dateB - dateA;
        });
        
        sortedPullRequests.unshift({
          timestamp: "NOW",
          url: "https://github.com/BUGS-NYU",
          user: "",
          text: `Make this your contribution!`,
        });

        setPRList(sortedPullRequests);
      } catch (error) {
        console.log(error);
        setPRList([])
      }
    }
    fetchData();
  }, []);

  return (
    <MainContainer>
      <PageContainer>
        <MainDescriptionContainer>
          <TableContainer>
            <Title><BoldText>
            Contributors
            </BoldText></Title>
            {Object.keys(contributors).map((name) => {
              return <Name key={name}>{name}</Name>;
            })}
          </TableContainer>
          <TimelineContainer>
          <Title>
            Our <BoldText>
            Open Source </BoldText> Timeline
          </Title>
            <Timeline>
            {PRList.length !== 0 &&
                Object.entries(PRList).map(([index, PR]) => {
                  if (index % 2 === 0) {
                    return (
                      <LeftContainer key={PR.url} light={light}>
                          <Time>{PR.timestamp}</Time>
                          <ContentURL href={PR.url}>
                          <Content light={light}>
                            {PR.text}
                          </Content>
                          </ContentURL>
                      </LeftContainer>
                    );
                  } else {
                    return (
                      <RightContainer key={PR.url} light={light}>
                          <Time>{PR.timestamp}</Time>
                          <ContentURL href={PR.url}>
                          <Content light={light}>
                            {PR.text}
                          </Content>
                          </ContentURL>
                      </RightContainer>
                    );
                  }
                })}
            </Timeline>

            </TimelineContainer>        </MainDescriptionContainer>
      </PageContainer>
    </MainContainer>
  );
};

export default ContributorsPage;
