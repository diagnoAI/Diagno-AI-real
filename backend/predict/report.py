from fpdf import FPDF
from datetime import datetime
import os
from PIL import Image

class DiagnoAIReportPDF(FPDF):
    def header(self):
        # Gradient-like header background
        self.set_fill_color(0, 102, 204)  # Dark blue
        self.rect(0, 0, 210, 35, 'F')
        self.set_fill_color(0, 102, 204)  # Lighter blue
        self.rect(0, 0, 210, 17, 'F')
        
        # Header text
        self.set_font('Arial', 'B', 26)
        self.set_text_color(255, 255, 255)
        self.set_y(8)
        self.cell(0, 10, "DIAGNO AI REPORT", 0, 1, 'C')
        self.set_font('Arial', 'I', 10)
        self.set_y(20)
        self.cell(0, 5, "Advanced Kidney Stone Analysis", 0, 1, 'C')
        self.set_y(35)  # Set cursor just below header
        self.ln(5)

    def footer(self):
        self.set_y(-25)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(255, 255, 255)
        self.set_fill_color(0, 102, 204)
        self.rect(0, self.get_y(), 210, 25, 'F')
        self.cell(0, 8, f"© {datetime.now().year} Diagno AI. All rights reserved.", 0, 1, 'C')
        self.cell(0, 8, "Contact: info@diagnoai.com | www.diagnoai.com", 0, 1, 'C')

    def add_page_border(self):
        self.set_line_width(0.3)
        self.set_draw_color(0, 102, 204)
        self.rect(5, 5, 200, 287, 'D')  # A4 page border (210x297mm, 5mm margin)

    def add_patient_details_table(self, patient_data):
        self.set_font('Arial', 'B', 12)
        self.set_text_color(0, 0, 0)
        self.set_fill_color(230, 240, 245)
        self.cell(0, 10, "Patient Information", 0, 1, 'L', True)
        self.ln(2)

        self.set_font('Arial', 'B', 10)
        col_width = 45
        row_height = 8
        self.set_line_width(0.5)
        self.set_draw_color(0, 102, 204)
        
        # Center the table
        x_start = (210 - (col_width * 4)) / 2
        self.set_x(x_start)
        
       # Table Row 1
        self.set_fill_color(245, 245, 245)
        self.cell(col_width, row_height, "Patient Name", 1, 0, 'C', True)
        self.cell(col_width, row_height, "Patient ID" , 1, 0, 'C', True)
        self.cell(col_width, row_height, "Age / Gender", 1, 0, 'C', True)
        self.cell(col_width, row_height, "Date of Scan", 1, 1, 'C', True)
        
        self.set_font('Arial', '', 10)
        # Table Row 2
        self.set_fill_color(255, 255, 255)
        self.set_x(x_start)
        self.cell(col_width, row_height, patient_data.get('name', 'Not Provided') , 1, 0, 'C', True)
        self.cell(col_width, row_height, patient_data.get('patient_id', 'Not Provided'), 1, 0, 'C', True)
        age_gender = f"{patient_data.get('age', 'N/A')} / {patient_data.get('gender', 'N/A')}"
        self.cell(col_width, row_height, age_gender, 1, 0, 'C', True)
        self.cell(col_width, row_height, patient_data.get('date_of_scan', 'Not Provided'), 1, 1, 'C', True)
        
        # Section separator
        self.set_line_width(0.2)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(5)

    def add_findings(self, stone_details):
        self.set_font('Arial', 'B', 12)
        self.set_text_color(0, 0, 0)
        self.set_fill_color(230, 240, 245)
        self.cell(0, 10, "Findings", 0, 1, 'L', True)
        self.ln(2)

        self.set_font('Arial', '', 10)
        num_stones = stone_details.get('number_of_stones', 0)
        self.cell(0, 6, f"Number of Stones: {num_stones}", 0, 1)

        if num_stones > 0 and stone_details.get('stones'):
            for stone_num, stone in stone_details['stones'].items():
                side = stone.get('left or right', 'Unknown')
                location = stone.get('stone located', 'Unknown')
                size = stone.get('Stone size', 'Unknown')
                shape = stone.get('Stone shape', 'Unknown')
                self.cell(0, 6, f"Stone {stone_num.replace('Stone', '')} was located in {side} kidney in {location}. "
                               f"Stone size was {size} in {shape} shape.", 0, 1)
        else:
            self.cell(0, 6, "No stones detected.", 0, 1)
        
        # Section separator
        self.set_line_width(0.2)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(5)

    def add_risk_level(self, stone_details):
        self.set_font('Arial', 'B', 12)
        self.set_text_color(0, 0, 0)
        self.set_fill_color(230, 240, 245)
        self.cell(0, 10, "Risk Assessment", 0, 1, 'L', True)
        self.ln(2)

        self.set_font('Arial', '', 10)
        sizes = [float(size.replace('mm', '').strip()) for size in [stone.get('Stone size', '0mm') for stone in stone_details.get('stones', {}).values()]]
        risk_level = "Low" if max(sizes, default=0) <= 5 else "Medium" if max(sizes, default=0) <= 10 else "High"
        high_risk_stones = [f"Stone {i+1}" for i, size in enumerate(sizes) if size > 6]

        self.cell(0, 6, f"Overall Risk Level: {risk_level}", 0, 1)
        if high_risk_stones:
            self.cell(0, 6, f"Stones with elevated risk (>6mm): {', '.join(high_risk_stones)}", 0, 1)
        else:
            self.cell(0, 6, "No stones with elevated risk detected.", 0, 1)
        
        # Section separator
        self.set_line_width(0.2)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(5)

    def add_images(self, input_image_path, overlay_image_path):
        self.set_font('Arial', 'B', 12)
        self.set_text_color(0, 0, 0)
        self.set_fill_color(230, 240, 245)
        self.cell(0, 10, "Imaging Results", 0, 1, 'L', True)
        self.ln(2)

        if os.path.exists(input_image_path) and os.path.exists(overlay_image_path):
            try:
                current_y = self.get_y()
                # Input image (left)
                self.image(input_image_path, x=15, y=current_y, w=85, h=65)
                # Overlay image (right)
                overlay_img = Image.open(overlay_image_path)
                temp_jpg_path = os.path.join(os.path.dirname(overlay_image_path), "temp_overlay.jpg")
                overlay_img.save(temp_jpg_path, "JPEG")
                self.image(temp_jpg_path, x=110, y=current_y, w=85, h=65)
                os.remove(temp_jpg_path)  # Cleanup
                self.set_y(current_y + 70)  # Move cursor below images
            except Exception as e:
                self.set_text_color(255, 0, 0)
                self.cell(0, 6, f"Image error: {str(e)}", 0, 1)
        else:
            self.set_text_color(255, 0, 0)
            self.cell(0, 6, "Images unavailable", 0, 1)
        
        # Section separator
        self.set_line_width(0.2)
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(5)

    def add_doctor_signature(self):
        self.ln(5)
        self.set_font('Arial', 'I', 10)
        self.set_text_color(0, 0, 0)
        # Dynamically adjust y-position to stay above footer
        current_y = self.get_y()
        if current_y + 20 > 277:  # 277mm is approx. page bottom - footer height (20mm)
            self.add_page()
            self.set_y(250)  # Position near bottom of new page
        else:
            self.set_y(-50)  # Stay 50mm above footer on current page
        self.set_x(130)  # Right-aligned
        self.cell(60, 8, "Doctor's Signature:", 0, 1, 'L')
        self.set_x(130)
        self.cell(60, 8, "____________________", 0, 1, 'L')

def generate_diagnose_ai_report(patient_data, input_image_path, overlay_image_path, stone_details, output_file):
    pdf = DiagnoAIReportPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.add_page_border()

    pdf.add_patient_details_table(patient_data)
    pdf.add_findings(stone_details)
    pdf.add_risk_level(stone_details)
    pdf.add_images(input_image_path, overlay_image_path)
    
    # Ensure signature is placed at the bottom-right, before footer
    pdf.add_doctor_signature()

    pdf.output(output_file)
    print(f"Report generated as {output_file}")
    print("Patient Data:", patient_data)
    print("Stone Details:", stone_details)