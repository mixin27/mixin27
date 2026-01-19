import { Metadata } from 'next'
import { Code2, Rocket, Users, Award } from 'lucide-react'
import { generateOGMetadata } from '@/lib/og'

export const metadata: Metadata = generateOGMetadata({
    title: 'About Me',
    description:
        'Learn more about my journey as a mobile developer, my skills, experience, and what drives my passion for creating great apps.',
    url: '/about',
})

const skills = {
    'Mobile Development': [
        'Flutter',
        'React Native',
        // 'iOS (Swift/SwiftUI)',
        'Android (Kotlin/Jetpack Compose)',
    ],
    'Backend & APIs': ['Node.js', 'Firebase', 'REST APIs', 'GraphQL'],
    Frontend: ['React', 'Next'],
    'Tools & Practices': [
        'Git & GitHub',
        'CI/CD',
        // 'Agile/Scrum',
        // 'App Store Optimization',
    ],
    // Design: [
    //   'UI/UX Design',
    //   'Figma',
    //   'Material Design',
    //   'Human Interface Guidelines',
    // ],
}

const experience = [
    {
        year: 'Nov 2023 - Present',
        title: 'Freelance Mobile Developer',
        company: 'Freelance',
        description: 'Building independent projects that the clients need',
        tasks: [
            'Developed and published multiple Flutter applications including Myanmar Calendar, Maun News, Beads Math, and Yoyo Chatt.',
            'Implemented features such as real-time chat, multi-language support, date conversion, onboarding flows, ads monetization, and API integrations.',
            'Managed full development lifecycle: UI/UX → backend integration → testing → Play Store release.',
            'Worked independently on architecture, state management, and app performance optimization.',
            'Built Myanmar Calendar (10K+ downloads), a multi-language Flutter app with date conversion & traditional Burmese calendar features.'
        ],
    },
    {
        year: 'MAR 2022 - OCT 2024',
        title: 'Mobile Developer',
        company: 'SYSTEMATIC Business Solutions',
        description:
            'Developed and maintained multiple mobile applications for iOS and Android using Flutter.',
        tasks: [
            'Designed and developed production Flutter applications for business clients, collaborating with designers, backend developers, and QA teams.',
            'Migrated legacy Android and Xamarin apps to Flutter, reducing maintenance effort and improving cross-platform consistency.',
            'Built reusable Flutter components and internal frameworks, reducing overall development time by ~20% across projects.',
        ],
    },
    {
        year: 'OCT 2019 - APR 2020',
        title: 'Junior Android Developer',
        company: 'Etrade Myanmar',
        description:
            'Started my journey in mobile development, learning and growing with each project.',
        tasks: [
            'Assisted in developing Android applications using Java and Kotlin, following modern Android development practices.',
            'Fixed bugs, improved UI/UX, and optimized app performance under guidance from senior developers.',
        ],
    },
    {
        year: 'MAY 2019 - AUG 2019',
        title: 'Internship - Web Developer',
        company: 'IrraHub',
        description:
            'Started my journey in software development as an internship developer, learning and growing with each project.',
        tasks: [
            'Assisted in developing web applications using Node.js, React, and MySQL.',
            'Implemented frontend features and supported backend API integration.',
            'Worked closely with team members on feature implementation and basic testing.'
        ],
    },
]

const values = [
    {
        icon: Code2,
        title: 'Clean Code',
        description:
            'I believe in writing maintainable, scalable, and well-documented code that stands the test of time.',
    },
    {
        icon: Rocket,
        title: 'Innovation',
        description:
            'Always exploring new technologies and approaches to solve problems more effectively.',
    },
    {
        icon: Users,
        title: 'User-Centric',
        description:
            'Every decision is made with the end user in mind, ensuring the best possible experience.',
    },
    {
        icon: Award,
        title: 'Quality First',
        description:
            'Committed to delivering high-quality work that exceeds expectations and industry standards.',
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="border-b bg-gradient-to-b from-background to-muted/20">
                <div className="container py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                About Me
                            </h1>
                            <p className="text-xl text-muted-foreground mb-6">
                                I'm a passionate mobile developer with a deep love for creating
                                beautiful, functional, and user-friendly applications.
                            </p>
                            <p className="text-muted-foreground">
                                With over four years of experience in mobile development, I've
                                had the privilege of working on diverse projects, from startups
                                to enterprise applications. My journey in tech has been driven
                                by curiosity, continuous learning, and a commitment to
                                excellence.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center">
                                <div className="text-8xl font-bold text-primary/20">KZT</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="container py-16">
                <h2 className="text-3xl font-bold mb-12 text-center">What I Value</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value) => (
                        <div
                            key={value.title}
                            className="rounded-lg border bg-card p-6 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <value.icon className="size-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">{value.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills Section */}
            <section className="border-t bg-muted/20">
                <div className="container py-16">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Skills & Expertise
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Object.entries(skills).map(([category, items]) => (
                            <div key={category} className="space-y-4">
                                <h3 className="font-semibold text-lg">{category}</h3>
                                <ul className="space-y-2">
                                    {items.map((skill) => (
                                        <li
                                            key={skill}
                                            className="flex items-center gap-2 text-sm text-muted-foreground"
                                        >
                                            <span className="size-1.5 rounded-full bg-primary" />
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="border-t">
                <div className="container py-16">
                    <h2 className="text-3xl font-bold mb-12 text-center">Experience</h2>
                    <div className="max-w-3xl mx-auto space-y-8">
                        {experience.map((exp, index) => (
                            <div
                                key={index}
                                className="relative pl-8 pb-8 border-l-2 last:pb-0"
                            >
                                <div className="absolute -left-2 top-0 size-4 rounded-full bg-primary border-4 border-background" />
                                <div className="rounded-lg border bg-card p-6">
                                    <div className="text-sm text-primary font-medium mb-2">
                                        {exp.year}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-1">{exp.title}</h3>
                                    <p className="text-muted-foreground mb-2">{exp.company}</p>
                                    <p className="text-sm">{exp.description}</p>
                                    <div className="my-2 mx-6">
                                        {exp.tasks &&
                                            exp.tasks.map((task, index) => (
                                                <li className="text-sm" key={index}>
                                                    {task}
                                                </li>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Education Section */}
            <section className="border-t bg-muted/20">
                <div className="container py-16">
                    <h2 className="text-3xl font-bold mb-12 text-center">Education</h2>
                    <div className="max-w-3xl mx-auto">
                        <div className="rounded-lg border bg-card p-8">
                            <h3 className="text-2xl font-semibold mb-2">
                                Bachelor of Computer Science
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                University of Computer Studies, Yangon • 2014 - 2019
                            </p>
                            <p className="text-sm">
                                Graduated with GPA grade <b>B</b>, focusing on software
                                engineering, data mining and artificial intelegence. Completed
                                various projects involving HTML, CSS3, Javascript, Java, C# and
                                Android development, gaining practical experience in building
                                real-world applications.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t">
                <div className="container py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
                        <p className="text-muted-foreground mb-8">
                            I'm always interested in hearing about new projects and
                            opportunities. Whether you have a question or just want to say hi,
                            feel free to reach out!
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Get In Touch
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
