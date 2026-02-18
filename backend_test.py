import requests
import sys
import os
import json
from datetime import datetime

class VidyaGuideAPITester:
    def __init__(self):
        # Use the public endpoint from frontend/.env
        self.base_url = "https://skill-compass-44.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_analysis_id = None

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")

    def test_root_endpoint(self):
        """Test GET /api/ endpoint"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=30)
            success = response.status_code == 200
            data = response.json() if response.status_code == 200 else {}
            
            if success:
                expected_message = "VidyaGuide AI API is running"
                success = data.get('message') == expected_message
                details = f"Expected '{expected_message}', got '{data.get('message')}'" if not success else ""
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Root endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root endpoint", False, str(e))
            return False

    def test_manual_analysis(self):
        """Test POST /api/analyze-manual endpoint"""
        test_data = {
            "full_name": "John Test Smith",
            "email": "john.test@example.com", 
            "phone": "+1-555-0123",
            "education": "B.Tech in Computer Science from XYZ University (2020-2024)\nGPA: 8.5/10\nRelevant Courses: Data Structures, Algorithms, Database Systems, Machine Learning",
            "skills": "Python, JavaScript, React, Node.js, SQL, MongoDB, Git, Docker, AWS, Machine Learning, REST APIs, GraphQL",
            "experience": "Software Development Intern at ABC Corp (June 2023 - Aug 2023)\n- Built REST APIs using Python Flask\n- Developed frontend components with React\n- Collaborated with senior developers on feature implementation\n- Participated in code reviews and agile ceremonies",
            "interests": "Full-stack web development, AI/ML applications, Cloud computing, Open source contributions, DevOps practices",
            "career_goals": "I want to become a Senior Full Stack Developer at a leading tech company within 3 years. I'm particularly interested in building scalable web applications and exploring AI/ML integration in web services."
        }
        
        try:
            print("🔄 Starting manual analysis (this may take 30-120 seconds with real AI)...")
            response = requests.post(
                f"{self.base_url}/analyze-manual", 
                json=test_data, 
                headers={'Content-Type': 'application/json'},
                timeout=120  # 2 minute timeout for AI processing
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                # Validate required fields
                required_fields = [
                    'id', 'full_name', 'resume_score', 'resume_improvements',
                    'career_paths', 'skill_gaps', 'learning_roadmap', 
                    'strengths', 'summary', 'created_at', 'input_type'
                ]
                
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    success = False
                    details = f"Missing fields: {missing_fields}"
                else:
                    # Store analysis ID for other tests
                    self.created_analysis_id = data.get('id')
                    
                    # Validate data types and content
                    validations = [
                        (isinstance(data['resume_score'], int) and 0 <= data['resume_score'] <= 100, "resume_score should be int 0-100"),
                        (isinstance(data['resume_improvements'], list) and len(data['resume_improvements']) >= 3, "resume_improvements should have 3+ items"),
                        (isinstance(data['career_paths'], list) and len(data['career_paths']) >= 3, "career_paths should have 3+ items"),
                        (isinstance(data['skill_gaps'], list) and len(data['skill_gaps']) >= 3, "skill_gaps should have 3+ items"),
                        (isinstance(data['learning_roadmap'], list) and len(data['learning_roadmap']) >= 3, "learning_roadmap should have 3+ items"),
                        (isinstance(data['strengths'], list) and len(data['strengths']) >= 3, "strengths should have 3+ items"),
                        (data['input_type'] == 'manual', "input_type should be 'manual'"),
                        (data['full_name'] == test_data['full_name'], "full_name should match input")
                    ]
                    
                    failed_validations = [msg for valid, msg in validations if not valid]
                    if failed_validations:
                        success = False
                        details = f"Validation failures: {failed_validations}"
                    else:
                        details = f"Analysis created with ID: {self.created_analysis_id}, Score: {data['resume_score']}"
            else:
                try:
                    error_data = response.json()
                    details = f"Status: {response.status_code}, Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Manual analysis", success, details)
            return success
        except requests.exceptions.Timeout:
            self.log_test("Manual analysis", False, "Timeout after 120 seconds - AI processing may be taking longer")
            return False
        except Exception as e:
            self.log_test("Manual analysis", False, str(e))
            return False

    def test_get_analysis(self):
        """Test GET /api/analysis/{id} endpoint"""
        if not self.created_analysis_id:
            self.log_test("Get specific analysis", False, "No analysis ID available from previous test")
            return False
            
        try:
            response = requests.get(f"{self.base_url}/analysis/{self.created_analysis_id}", timeout=30)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                # Validate the returned data matches what we expect
                validations = [
                    (data.get('id') == self.created_analysis_id, "ID should match requested ID"),
                    (data.get('full_name') == "John Test Smith", "Name should match"),
                    ('resume_score' in data, "Should contain resume_score"),
                    ('career_paths' in data, "Should contain career_paths"),
                    ('skill_gaps' in data, "Should contain skill_gaps")
                ]
                
                failed_validations = [msg for valid, msg in validations if not valid]
                if failed_validations:
                    success = False
                    details = f"Validation failures: {failed_validations}"
                else:
                    details = f"Successfully retrieved analysis for {data.get('full_name')}"
            else:
                try:
                    error_data = response.json()
                    details = f"Status: {response.status_code}, Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details = f"Status: {response.status_code}"
            
            self.log_test("Get specific analysis", success, details)
            return success
        except Exception as e:
            self.log_test("Get specific analysis", False, str(e))
            return False

    def test_list_analyses(self):
        """Test GET /api/analyses endpoint"""
        try:
            response = requests.get(f"{self.base_url}/analyses", timeout=30)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                
                # Should be a list
                if not isinstance(data, list):
                    success = False
                    details = "Response should be a list"
                else:
                    # If we created an analysis, it should be in the list
                    if self.created_analysis_id:
                        found_analysis = any(item.get('id') == self.created_analysis_id for item in data)
                        if not found_analysis:
                            success = False
                            details = f"Created analysis {self.created_analysis_id} not found in list"
                        else:
                            details = f"Found {len(data)} analyses including our test analysis"
                    else:
                        details = f"Retrieved {len(data)} analyses"
            else:
                try:
                    error_data = response.json()
                    details = f"Status: {response.status_code}, Error: {error_data.get('detail', 'Unknown error')}"
                except:
                    details = f"Status: {response.status_code}"
            
            self.log_test("List all analyses", success, details)
            return success
        except Exception as e:
            self.log_test("List all analyses", False, str(e))
            return False

    def test_invalid_analysis_id(self):
        """Test GET /api/analysis/{id} with invalid ID"""
        try:
            fake_id = "invalid-analysis-id-12345"
            response = requests.get(f"{self.base_url}/analysis/{fake_id}", timeout=30)
            success = response.status_code == 404
            
            if success:
                details = "Correctly returned 404 for invalid ID"
            else:
                details = f"Expected 404, got {response.status_code}"
            
            self.log_test("Invalid analysis ID handling", success, details)
            return success
        except Exception as e:
            self.log_test("Invalid analysis ID handling", False, str(e))
            return False

    def test_malformed_manual_data(self):
        """Test POST /api/analyze-manual with invalid data"""
        try:
            # Test with missing required field
            incomplete_data = {
                "email": "test@example.com",
                "skills": "Python, JavaScript"
                # Missing required 'full_name'
            }
            
            response = requests.post(
                f"{self.base_url}/analyze-manual", 
                json=incomplete_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            # Should return 4xx error for invalid data
            success = 400 <= response.status_code < 500
            
            if success:
                details = f"Correctly returned {response.status_code} for invalid data"
            else:
                details = f"Expected 4xx error, got {response.status_code}"
            
            self.log_test("Malformed data handling", success, details)
            return success
        except Exception as e:
            self.log_test("Malformed data handling", False, str(e))
            return False

    def cleanup_test_data(self):
        """Clean up the test analysis if possible"""
        if self.created_analysis_id:
            try:
                response = requests.delete(f"{self.base_url}/analysis/{self.created_analysis_id}", timeout=30)
                if response.status_code == 200:
                    print(f"🧹 Cleaned up test analysis {self.created_analysis_id}")
                else:
                    print(f"⚠️  Could not clean up test analysis {self.created_analysis_id}")
            except Exception as e:
                print(f"⚠️  Cleanup failed: {e}")

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting VidyaGuide API Tests")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity first
        if not self.test_root_endpoint():
            print("❌ Root endpoint failed - API may be down")
            return False
        
        # Test core functionality
        self.test_manual_analysis()  # This creates an analysis for other tests
        self.test_get_analysis()
        self.test_list_analyses()
        
        # Test error handling
        self.test_invalid_analysis_id() 
        self.test_malformed_manual_data()
        
        # Cleanup
        self.cleanup_test_data()
        
        # Summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("✅ All backend tests passed!")
            return True
        else:
            print(f"❌ {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = VidyaGuideAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())