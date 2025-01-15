import { Injectable } from "@angular/core";
import { StringMap } from "../common/titles";

@Injectable({
    providedIn: 'root'
})

export class DataService {
    contentData: StringMap = {
        terms_and_condition: `<h2>Terms and Conditions</h2>
        <p>Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use:</p>
        <ul>
            <li>This is a dummy text for terms and conditions.</li>
            <li>Any resemblance to real persons, living or dead, is purely coincidental.</li>
            <li>This content is for demonstration purposes only.</li>
            <li>By accessing this website, you agree to these terms and conditions.</li>
            <li>This agreement is governed by the laws of Dummyland.</li>
            <li>Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.</li>
        </ul>
        <p>This is just a sample text. You should replace it with your own terms and conditions.</p>`,
        privacy_policy: `<h2>Privacy Policy</h2>
        <p>This privacy policy sets out how our website uses and protects any information that you give when you use this website. We are committed to ensuring that your privacy is protected.</p>
        <h3>What we collect</h3>
        <p>We may collect the following information:</p>
        <ul>
            <li>Name and job title</li>
            <li>Contact information including email address</li>
            <li>Demographic information such as postcode, preferences, and interests</li>
            <li>Other information relevant to customer surveys and/or offers</li>
        </ul>
        <h3>What we do with the information we gather</h3>
        <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
        <ul>
            <li>Internal record keeping.</li>
            <li>We may use the information to improve our products and services.</li>
            <li>We may periodically send promotional emails about new products, special offers, or other information which we think you may find interesting using the email address which you have provided.</li>
            <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax, or mail.</li>
            <li>We may use the information to customize the website according to your interests.</li>
        </ul>
        <h3>Security</h3>
        <p>We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.</p>
        <p>This is just a sample privacy policy. Please replace it with your own privacy policy.</p>
        `,
        events: `<h2>Events</h2>
        <p>Welcome to our events page! Here you can find information about upcoming events, workshops, conferences, and more.</p>
        <h3>Upcoming Events</h3>
        <ul>
            <li>
                <h4>Web Development Workshop</h4>
                <p>Date: January 15, 2024</p>
                <p>Time: 10:00 AM - 4:00 PM</p>
                <p>Location: Virtual (Online)</p>
                <p>Description: Join us for an intensive workshop on web development where you'll learn the latest technologies and best practices.</p>
            </li>
            <li>
                <h4>Networking Mixer</h4>
                <p>Date: February 5, 2024</p>
                <p>Time: 6:00 PM - 8:00 PM</p>
                <p>Location: ABC Conference Center</p>
                <p>Description: Connect with professionals from various industries at our networking mixer. Don't forget to bring your business cards!</p>
            </li>
        </ul>
        <h3>Past Events</h3>
        <ul>
            <li>
                <h4>Marketing Conference</h4>
                <p>Date: November 20, 2023</p>
                <p>Location: XYZ Hotel</p>
                <p>Description: Our recent marketing conference brought together experts and enthusiasts to discuss the latest trends and strategies in marketing.</p>
            </li>
            <li>
                <h4>Product Launch Party</h4>
                <p>Date: March 10, 2023</p>
                <p>Location: Company Headquarters</p>
                <p>Description: We celebrated the launch of our new product with a fun-filled party attended by clients, partners, and team members.</p>
            </li>
        </ul>
        <p>Stay tuned for updates on upcoming events! For inquiries or to suggest event ideas, please contact us.</p>
        `,
        blogs: `<h2>Latest Blog Posts</h2>
        <div class="blog-post">
            <h3>10 Tips for Successful Remote Work</h3>
            <p class="meta">Posted on January 20, 2024 by John Doe</p>
            <p>With the rise of remote work, it's essential to develop effective strategies for staying productive and maintaining work-life balance. Here are 10 tips to help you succeed...</p>
            <a href="#" class="read-more">Read more</a>
        </div>
        <div class="blog-post">
            <h3>The Future of Artificial Intelligence</h3>
            <p class="meta">Posted on February 5, 2024 by Jane Smith</p>
            <p>Artificial Intelligence (AI) continues to revolutionize industries and reshape our world. In this post, we explore the latest advancements in AI technology and its potential impact...</p>
            <a href="#" class="read-more">Read more</a>
        </div>
        <div class="blog-post">
            <h3>Healthy Habits for Increased Productivity</h3>
            <p class="meta">Posted on March 12, 2024 by Emily Johnson</p>
            <p>Productivity is not just about working harder; it's also about working smarter and taking care of your well-being. Discover some simple yet effective habits to boost your productivity...</p>
            <a href="#" class="read-more">Read more</a>
        </div>
        <div class="blog-post">
            <h3>The Importance of Continuous Learning</h3>
            <p class="meta">Posted on April 8, 2024 by Michael Brown</p>
            <p>In today's rapidly changing world, continuous learning is essential for personal and professional growth. Learn why lifelong learning is crucial and how to cultivate a learning mindset...</p>
            <a href="#" class="read-more">Read more</a>
        </div>
        `,
        partnership: `<section id="partnership">
        <h3>Partnership</h3>
        <p>We value collaboration and partnerships as integral components of our mission to deliver quality services and products. Partnering with us opens up opportunities for mutual growth and innovation.</p>
        
        <h4>Our Approach to Partnership</h4>
        <p>At Acme Solutions, we believe in fostering long-term relationships built on trust, transparency, and shared goals. Our approach to partnership is collaborative, focusing on creating value for all stakeholders involved.</p>
        
        <h4>Types of Partnerships</h4>
        <p>We offer various partnership models tailored to meet the specific needs and objectives of our partners. Whether you are a technology provider, a distributor, or an organization seeking to expand your market reach, we have partnership opportunities that can benefit both parties.</p>
        
        <h4>Benefits of Partnering with Us</h4>
        <p>Partnering with Acme Solutions brings numerous benefits, including:</p>
        <ul>
            <li>Access to cutting-edge technology and expertise</li>
            <li>Opportunities for co-development and innovation</li>
            <li>Expanded market reach and increased brand visibility</li>
            <li>Joint marketing and promotional activities</li>
            <li>Collaborative support and resources</li>
        </ul>
        
        <h4>Join Our Partner Network</h4>
        <p>If you are interested in exploring partnership opportunities with Acme Solutions, we invite you to reach out to us. Together, we can create mutually beneficial partnerships that drive growth, innovation, and success.</p>
    </section>
    `,
        business_relation: `<section id="business-relations">
    <h3>Business Relations</h3>
    <p>At Acme Solutions, we recognize the importance of building strong and enduring business relationships. Our commitment to fostering positive relationships with our clients, suppliers, partners, and stakeholders is fundamental to our success.</p>
    
    <h4>Client Relationships</h4>
    <p>We prioritize understanding our clients' needs and delivering solutions that exceed their expectations. By maintaining open lines of communication and providing exceptional service, we aim to build long-term partnerships based on trust and mutual respect.</p>
    
    <h4>Supplier Relationships</h4>
    <p>We value our suppliers as strategic partners in our supply chain. We strive to establish mutually beneficial relationships built on integrity, reliability, and fair business practices. Working collaboratively with our suppliers enables us to deliver high-quality products and services to our clients.</p>
    
    <h4>Partner Relationships</h4>
    <p>Partnerships are central to our approach to business. We actively seek out opportunities to collaborate with like-minded organizations to drive innovation, expand our reach, and create value for our clients. Our partnerships are based on shared goals, mutual respect, and a commitment to excellence.</p>
    
    <h4>Stakeholder Engagement</h4>
    <p>We are committed to engaging with our stakeholders in a transparent and meaningful way. By listening to their feedback, addressing their concerns, and involving them in our decision-making processes, we strive to build trust and confidence in our business practices.</p>
    
    <h4>Continuous Improvement</h4>
    <p>We believe in continuously improving our business relations through ongoing communication, collaboration, and feedback. By learning from our experiences and adapting to changing needs and circumstances, we aim to strengthen our relationships and drive sustainable growth.</p>
</section>
`,
        podcast: `<section id="podcasts">
<h3>Podcasts</h3>
<p>Welcome to the Acme Solutions podcast series! Tune in to hear insightful discussions, expert interviews, and thought-provoking conversations on a wide range of topics related to our industry.</p>

<h4>Episode 1: The Future of Technology</h4>
<p>In our inaugural episode, we explore the latest trends and innovations shaping the future of technology. Join our panel of experts as they discuss the impact of AI, IoT, and blockchain on businesses and society.</p>

<h4>Episode 2: Cybersecurity in the Digital Age</h4>
<p>In this episode, we delve into the world of cybersecurity and examine the evolving threats facing organizations in the digital age. Learn about the latest strategies and best practices for protecting your data and networks.</p>

<h4>Episode 3: The Power of Data Analytics</h4>
<p>Join us as we explore the power of data analytics and its role in driving business insights and decision-making. Our guests share real-world examples of how organizations are leveraging data to gain a competitive edge.</p>

<h4>Episode 4: Women in Tech</h4>
<p>In celebration of Women's History Month, we shine a spotlight on women in tech and their contributions to the industry. Hear from inspirational female leaders who are breaking barriers and paving the way for future generations.</p>

<h4>Episode 5: The Future of Work</h4>
<p>As remote work becomes the new normal, we explore the future of work and its implications for employers and employees alike. Join us as we discuss the benefits, challenges, and opportunities of a flexible work environment.</p>
</section>
`,
featured: `<section id="featured-cars">
<h3>Featured Cars</h3>

<div class="car">
    <h4>2023 Model: XYZ Sedan</h4>
    <p>Experience luxury and performance with the all-new 2023 XYZ Sedan. Featuring advanced technology, spacious interior, and elegant design, this sedan offers the ultimate driving experience.</p>
    <a href="#" class="btn">Learn More</a>
</div>

<div class="car">
    <h4>2023 Model: ABC SUV</h4>
    <p>Unleash adventure with the rugged and versatile 2023 ABC SUV. Whether you're exploring off-road trails or cruising through city streets, this SUV delivers unmatched capability and comfort.</p>
    <a href="#" class="btn">Learn More</a>
</div>

<div class="car">
    <h4>2023 Model: PQR Electric</h4>
    <p>Go green with the environmentally-friendly 2023 PQR Electric. With zero emissions and innovative features, this electric car redefines sustainability without compromising on performance.</p>
    <a href="#" class="btn">Learn More</a>
</div>
</section>
`,
how_it_works: `<section id="how-it-works">
<h3>How It Works</h3>

<div class="step">
    <h4>1. Choose Your Car</h4>
    <p>Browse our wide selection of vehicles and choose the one that suits your needs and preferences. We offer various models ranging from compact cars to luxury SUVs.</p>
</div>

<div class="step">
    <h4>2. Book Online</h4>
    <p>Once you've selected your desired car, book it online through our user-friendly reservation system. Specify the pickup location, rental dates, and any additional preferences.</p>
</div>

<div class="step">
    <h4>3. Pick Up Your Car</h4>
    <p>Head to our designated pickup location at the scheduled time to collect your rental car. Our staff will assist you with the paperwork and ensure a smooth handover process.</p>
</div>

<div class="step">
    <h4>4. Enjoy Your Ride</h4>
    <p>Hit the road and enjoy the freedom and flexibility of having your own car. Explore your destination at your own pace and make unforgettable memories along the way.</p>
</div>
</section>
`

    }
}