import { getPasswordChecks } from "../../utils/passwordValidation";

const PasswordRequirements = ({ password }) => {
  const checks = getPasswordChecks(password);

  return (
    <div className="password-requirements" aria-live="polite">
      <p><strong>Password requirements</strong></p>
      <ul>
        {checks.map((check) => (
          <li
            key={check.id}
            className={check.isValid ? "requirement-valid" : "requirement-pending"}
          >
            <span aria-hidden="true">{check.isValid ? "✓" : "•"}</span>
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
