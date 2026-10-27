
import { useEffect } from "react";
import { useNavigate } from "react-router";

const ROLE_SETTINGS_ROUTES = {
    club_admin: "/club",
    member: "/settings/photo",
    photographer: "/settings/photo",
    judge: "/judge/settings",
    secretary: "/secretary/settings",
    speaker: "/speaker/settings",
    super_admin: "/super/settings",
};

function SettingsRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const stored = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const role = String(
                stored?.roles?.[0]?.name || ""
            )
                .trim()
                .toLowerCase();

            const destination = ROLE_SETTINGS_ROUTES[role];

            navigate(destination || "/login", {
                replace: true,
            });
        } catch (error) {
            console.error("Unable to read user role:", error);
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    return null;
}

export default SettingsRedirect;
