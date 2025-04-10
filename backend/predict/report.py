from fpdf import FPDF
from datetime import datetime
import os
from PIL import Image

class DiagnoAIReportPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(255, 255, 255)
        self.set_fill_color(0, 102, 204)
        self.rect(0, 0, 210, 15, 'F')
        self.cell(200, 10, "Diagno AI Report", ln=True, align="C")
        self.ln(5)

    def footer(self):
        self.set_y(-10)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f"Page {self.page_no()} | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 0, 'C')

    def add_patient_details(self, patient_data):
        self.ln(2)
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(240, 240, 240)
        self.rect(10, self.get_y(), 190, 25, 'F')
        self.cell(0, 5, "Patient Details", ln=True, align="L")
        self.set_font('Helvetica', '', 8)
        self.set_text_color(0, 0, 0)
        self.cell(0, 4, f"Name: {patient_data.get('name', 'N/A')}", ln=True)
        self.cell(0, 4, f"Age: {patient_data.get('age', 'N/A')} years", ln=True)
        self.cell(0, 4, f"Patient ID: {patient_data.get('patient_id', 'N/A')}", ln=True)
        self.cell(0, 4, f"Date of Scan: {patient_data.get('date_of_scan', 'N/A')}", ln=True)
        self.ln(2)

    def add_images(self, input_image_path, overlay_image_path):
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(240, 240, 240)
        self.rect(10, self.get_y(), 190, 40, 'F')
        self.cell(0, 5, "Imaging Analysis", ln=True, align="L")
        self.ln(2)

        if os.path.exists(input_image_path) and os.path.exists(overlay_image_path):
            try:
                self.image(input_image_path, x=10, y=self.get_y(), w=80, h=35)
                # Ensure overlay is in a compatible format
                overlay_img = Image.open(overlay_image_path)
                temp_jpg_path = os.path.join(os.path.dirname(overlay_image_path), "temp_overlay.jpg")
                overlay_img.save(temp_jpg_path, "JPEG")
                self.image(temp_jpg_path, x=100, y=self.get_y(), w=80, h=35)
                os.remove(temp_jpg_path)  # Cleanup
            except Exception as e:
                self.cell(0, 5, f"Image error: {str(e)}", ln=True)
        else:
            self.cell(0, 5, "Images unavailable", ln=True)
        self.ln(37)

    def add_stone_details(self, stone_details):
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(240, 240, 240)
        height = 20 + 12 * len(stone_details.get('stones', {}))
        self.rect(10, self.get_y(), 190, height, 'F')
        self.cell(0, 5, "Stone Detection Summary", ln=True, align="L")
        self.set_font('Helvetica', '', 8)
        self.cell(0, 4, f"Number of Stones: {stone_details.get('number_of_stones', 0)}", ln=True)
        self.ln(2)
        if stone_details.get('stones'):
            for stone_num, stone in stone_details["stones"].items():
                self.cell(0, 4, f"{stone_num}:", ln=True)
                self.cell(5, 4, '', 0, 0)
                self.cell(0, 4, f"Side: {stone.get('left or right', 'N/A')}", ln=True)
                self.cell(5, 4, '', 0, 0)
                self.cell(0, 4, f"Location: {stone.get('stone located', 'N/A')}", ln=True)
                self.cell(5, 4, '', 0, 0)
                self.cell(0, 4, f"Size: {stone.get('Stone size', 'N/A')}", ln=True)
                self.cell(5, 4, '', 0, 0)
                self.cell(0, 4, f"Shape: {stone.get('Stone shape', 'N/A')}", ln=True)
        self.ln(2)

    def add_clinical_recommendation(self, stone_details):
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(240, 240, 240)
        height = 15 + 4 * len(stone_details.get('stones', {}))
        self.rect(10, self.get_y(), 190, height, 'F')
        self.cell(0, 5, "Clinical Recommendation", ln=True, align="L")
        self.set_font('Helvetica', '', 8)
        stones = stone_details.get('stones', {})
        recommendation = []
        for stone_num, stone in stones.items():
            size = float(stone.get("Stone size", "0").replace("mm", ""))
            recommendation.append(f"{stone_num}: {'>6mm' if size > 6 else '<6mm'} - {'Urologist eval' if size > 6 else 'Monitor'}")
        self.set_xy(15, self.get_y() + 2)
        self.multi_cell(0, 4, "\n".join(recommendation) or "Normal kidney, no action required.")
        self.ln(2)

def generate_diagnose_ai_report(patient_data, input_image_path, overlay_image_path, stone_details, output_file):
    pdf = DiagnoAIReportPDF()
    pdf.set_auto_page_break(auto=False, margin=10)
    pdf.add_page()
    pdf.set_font("Helvetica", size=8)

    pdf.add_patient_details(patient_data)
    pdf.add_images(input_image_path, overlay_image_path)
    pdf.add_stone_details(stone_details)
    pdf.add_clinical_recommendation(stone_details)

    pdf.output(output_file)
    print(f"Report saved as {output_file}")