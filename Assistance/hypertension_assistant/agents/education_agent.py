from typing import List


class EducationAgent:
    """Returns short, curated educational snippets about hypertension."""

    def __init__(self) -> None:
        self._snippets = {
            "what_is_htn": (
                "Hypertension (high blood pressure) means the force of blood against your artery walls "
                "is consistently too high. Over time, this increases the risk of heart attack, stroke, "
                "kidney disease, and other problems."
            ),
            "lifestyle": (
                "Key lifestyle steps for blood pressure control include: reducing salt intake, eating more "
                "fruits and vegetables, staying physically active most days of the week, maintaining a "
                "healthy weight, limiting alcohol, and not smoking."
            ),
            "meds": (
                "Blood pressure medicines work best when they are taken exactly as prescribed. Do not stop "
                "or change them on your own; always talk with your doctor first if you have side effects "
                "or concerns."
            ),
            "monitoring": (
                "Home blood pressure monitoring can help you and your clinician see how your numbers change "
                "over time. Try to measure at the same times each day, in a calm setting, and record the values."
            ),
            "emergency": (
                "If you ever have very high blood pressure (around or above 180/120 mm Hg) together with "
                "severe chest pain, severe headache, confusion, trouble speaking, weakness, vision changes, "
                "or shortness of breath, treat it as an emergency and seek immediate in-person care."
            ),
        }

    def get_snippets_for_query(self, user_text: str) -> List[str]:
        text = user_text.lower()
        selected: List[str] = []

        if any(k in text for k in ["what is hypertension", "what is high blood pressure", "explain hypertension"]):
            selected.append(self._snippets["what_is_htn"])

        if any(k in text for k in ["diet", "salt", "exercise", "lifestyle", "walk"]):
            selected.append(self._snippets["lifestyle"])

        if any(k in text for k in ["medicine", "medication", "pill", "tablets", "side effect"]):
            selected.append(self._snippets["meds"])

        if any(k in text for k in ["monitor", "home reading", "bp monitor", "check my pressure"]):
            selected.append(self._snippets["monitoring"])

        if any(k in text for k in ["emergency", "crisis", "very high", "danger"]):
            selected.append(self._snippets["emergency"])

        if not selected:
            selected.append(self._snippets["what_is_htn"])

        return selected
