"""
SEO Implementation Tests for BreatheEasy PWA
Tests robots.txt, sitemap.xml, SEO landing pages, and footer links
"""
import pytest
import requests
import os
import xml.etree.ElementTree as ET

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestStaticSEOFiles:
    """Tests for static SEO files (robots.txt, sitemap.xml)"""
    
    def test_robots_txt_loads(self):
        """Test that robots.txt loads correctly"""
        response = requests.get(f"{BASE_URL}/robots.txt")
        assert response.status_code == 200
        assert "User-agent: *" in response.text
        assert "Allow: /" in response.text
        assert "Sitemap:" in response.text
        print("✓ robots.txt loads correctly with proper content")
    
    def test_sitemap_xml_loads(self):
        """Test that sitemap.xml loads correctly"""
        response = requests.get(f"{BASE_URL}/sitemap.xml")
        assert response.status_code == 200
        assert "<?xml" in response.text
        assert "<urlset" in response.text
        print("✓ sitemap.xml loads correctly")
    
    def test_sitemap_contains_7_urls(self):
        """Test that sitemap.xml contains all 7 required URLs"""
        response = requests.get(f"{BASE_URL}/sitemap.xml")
        assert response.status_code == 200
        
        # Parse XML
        root = ET.fromstring(response.text)
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = root.findall('.//ns:url', namespace)
        
        assert len(urls) == 7, f"Expected 7 URLs, found {len(urls)}"
        
        # Extract all loc values
        locs = [url.find('ns:loc', namespace).text for url in urls]
        
        # Check required URLs are present
        required_paths = ['/', '/help-now', '/tools', '/courses', 
                         '/panic-attack-help', '/breathing-exercise', '/anxiety-tools']
        
        for path in required_paths:
            found = any(path in loc or loc.endswith(path) for loc in locs)
            assert found, f"Missing URL for path: {path}"
        
        print(f"✓ sitemap.xml contains all 7 required URLs: {locs}")


class TestMainPagesLoad:
    """Tests for main pages loading with SEOHead component"""
    
    def test_home_page_loads(self):
        """Test that Home page loads"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
        print("✓ Home page loads successfully")
    
    def test_tools_page_loads(self):
        """Test that Tools page loads"""
        response = requests.get(f"{BASE_URL}/tools")
        assert response.status_code == 200
        print("✓ Tools page loads successfully")
    
    def test_courses_page_loads(self):
        """Test that Courses page loads"""
        response = requests.get(f"{BASE_URL}/courses")
        assert response.status_code == 200
        print("✓ Courses page loads successfully")
    
    def test_help_now_page_loads(self):
        """Test that Help Now page loads"""
        response = requests.get(f"{BASE_URL}/help-now")
        assert response.status_code == 200
        print("✓ Help Now page loads successfully")


class TestSEOLandingPages:
    """Tests for SEO landing pages"""
    
    def test_panic_attack_help_page_loads(self):
        """Test that /panic-attack-help SEO landing page loads"""
        response = requests.get(f"{BASE_URL}/panic-attack-help")
        assert response.status_code == 200
        print("✓ /panic-attack-help page loads successfully")
    
    def test_breathing_exercise_page_loads(self):
        """Test that /breathing-exercise SEO landing page loads"""
        response = requests.get(f"{BASE_URL}/breathing-exercise")
        assert response.status_code == 200
        print("✓ /breathing-exercise page loads successfully")
    
    def test_anxiety_tools_page_loads(self):
        """Test that /anxiety-tools SEO landing page loads"""
        response = requests.get(f"{BASE_URL}/anxiety-tools")
        assert response.status_code == 200
        print("✓ /anxiety-tools page loads successfully")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
