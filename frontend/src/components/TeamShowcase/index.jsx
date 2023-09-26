import React from "react";
import "./styles.css";

const TeamShowcase = ({ teams, teamMembers }) => {
  return (
    <div className="team-showcase">
      <div className="team-rows">
        {teams.map((team) => (
          <div className="team-row" key={team.id}>
            <strong>{team.name}</strong>
            <div className="members">
              {teamMembers
                .filter((member) => member.teamId === team.id)
                .map((member) => (
                  <div key={member.id} className="member">
                    {member.name}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamShowcase;
