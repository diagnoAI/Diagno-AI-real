from fpdf import FPDF
from datetime import datetime
import os
from PIL import Image

class NormalReportPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(255, 255, 255)
        self.set_fill_color(0, 102, 204)
        self.rect(0, 0, 210, 15, 'F')
        self.cell(200, 10, "Diagno AI Normal Report", ln=True, align="C")
        self.ln(5)

    def footer(self):
        self.set_y(-10)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f"Page {self.page_no()} | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 0, 'C')

    def add_patient_details(self, patient_data):
        self.ln(2)
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(240, 240, 240)
        self.rect(10, self.get_y(), 190, 20, 'F')
        self.cell(0, 5, "Patient Details", ln=True, align="L")
        self.set_font('Helvetica', '', 8)
        self.set_text_color(0, 0, 0)
        self.cell(0, 4, f"Name: {patient_data.get('name', 'N/A')}", ln=True)
        self.cell(0, 4, f"Age: {patient_data.get('age', 'N/A')} years", ln=True)
        self.cell(0, 4, f"Patient ID: {patient_data.get('patient_id', 'N/A')}", ln=True)
        self.cell(0, 4, f"Date of Scan: {patient_data.get('date_of_scan', 'N/A')}", ln=True)
        self.ln(2)

    def add_image(self, image_path):
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(240, 240, 240)
        self.rect(10, self.get_y(), 190, 40, 'F')
        self.cell(0, 5, "CT Scan Image", ln=True, align="L")
        self.ln(2)

        if os.path.exists(image_path):
            try:
                # Convert image to JPEG for fpdf compatibility
                temp_jpg_path = os.path.join(os.path.dirname(image_path), "temp_normal.jpg")
                img = Image.open(image_path).convert('RGB')  # Ensure RGB format
                img.save(temp_jpg_path, "JPEG")
                self.image(temp_jpg_path, x=10, y=self.get_y(), w=180, h=35)
                os.remove(temp_jpg_path)  # Cleanup
            except Exception as e:
                self.cell(0, 5, f"Image error: {str(e)}", ln=True)
        else:
            self.cell(0, 5, "Image unavailable", ln=True)
        self.ln(37)

    def add_conclusion(self):
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(240, 240, 240)
        self.rect(10, self.get_y(), 190, 15, 'F')
        self.cell(0, 5, "Conclusion", ln=True, align="L")
        self.set_font('Helvetica', '', 8)
        self.cell(0, 4, "No kidney stones detected. No further action required.", ln=True)
        self.ln(2)

def generate_normal_report(patient_data, image_path, output_file):
    pdf = NormalReportPDF()
    pdf.set_auto_page_break(auto=False, margin=10)
    pdf.add_page()
    pdf.set_font("Helvetica", size=8)

    pdf.add_patient_details(patient_data)
    pdf.add_image(image_path)
    pdf.add_conclusion()

    # Ensure output directory exists
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    pdf.output(output_file)
    print(f"Normal report saved as {output_file}")