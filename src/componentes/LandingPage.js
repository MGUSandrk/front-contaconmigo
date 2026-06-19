import React, { useState } from 'react';
import {
    FaBars,
    FaBook,
    FaBoxes,
    FaChartLine,
    FaCheckCircle,
    FaCodeBranch,
    FaDatabase,
    FaFileInvoiceDollar,
    FaLayerGroup,
    FaServer,
    FaShoppingCart,
    FaTimes,
    FaUsers,
} from 'react-icons/fa';

const palette = {
    page: '#F7FBFC',
    surface: '#FFFFFF',
    brand: '#A8DADC',
    active: '#4FB3C8',
    text: '#243447',
    muted: '#64748B',
    green: '#8BC6A7',
    coral: '#F4A7A3',
    border: '#E2EEF2',
};

const services = [
    {
        title: 'Ventas',
        description: 'Registra operaciones comerciales y mantenelas conectadas con la informacion administrativa.',
        icon: FaShoppingCart,
        color: palette.active,
        background: '#E8F7FA',
    },
    {
        title: 'Productos',
        description: 'Administra el catalogo de productos con datos claros para la gestion diaria.',
        icon: FaBoxes,
        color: palette.green,
        background: '#ECF8F1',
    },
    {
        title: 'Productos por lote',
        description: 'Controla partidas, costos y stock disponible para cada lote cargado.',
        icon: FaLayerGroup,
        color: '#7C9FD1',
        background: '#EDF4FF',
    },
    {
        title: 'Clientes',
        description: 'Centraliza clientes y relaciona su actividad con ventas y seguimiento comercial.',
        icon: FaUsers,
        color: palette.coral,
        background: '#FFF1F0',
    },
    {
        title: 'Contabilidad',
        description: 'Trabaja con plan de cuentas, asientos, libro diario y libro mayor.',
        icon: FaFileInvoiceDollar,
        color: '#5B7FA4',
        background: '#EEF5F8',
    },
    {
        title: 'Reportes',
        description: 'Visualiza informacion clave para entender mejor el movimiento del sistema.',
        icon: FaChartLine,
        color: '#C49A6C',
        background: '#FFF7EC',
    },
];

const dashboardItems = [
    { label: 'Ventas', value: '24', detail: 'operaciones cargadas', color: palette.active },
    { label: 'Productos por lote', value: '8', detail: 'partidas activas', color: '#7C9FD1' },
    { label: 'Clientes', value: '16', detail: 'registros vinculados', color: palette.coral },
    { label: 'Contabilidad', value: '100%', detail: 'datos en paralelo', color: palette.green },
];

const techItems = [
    { label: 'Frontend', value: 'React', icon: FaChartLine },
    { label: 'Backend', value: 'Spring Boot', icon: FaServer },
    { label: 'Base de datos', value: 'PostgreSQL', icon: FaDatabase },
];

const repoItems = [
    { label: 'Frontend repo', value: 'MGUSandrk/front-contaconmigo', href: 'https://github.com/MGUSandrk/front-contaconmigo' },
    { label: 'Backend repo', value: 'MGUSandrk/back-contaconmigo', href: 'https://github.com/MGUSandrk/back-contaconmigo' },
];

const LandingPage = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((current) => !current);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMenuOpen(false);
        }
    };

    const styles = {
        page: {
            background: palette.page,
            color: palette.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            overflowX: 'hidden',
        },
        navbar: {
            background: 'rgba(255, 255, 255, 0.94)',
            borderBottom: `1px solid ${palette.border}`,
            backdropFilter: 'blur(16px)',
            padding: '0.7rem 0',
        },
        brand: {
            color: palette.text,
            fontSize: '1.35rem',
            letterSpacing: '0',
        },
        navLink: {
            color: palette.muted,
            fontWeight: 600,
            border: 'none',
            background: 'transparent',
        },
        navLogin: {
            background: palette.text,
            color: '#FFFFFF',
            borderRadius: '999px',
            padding: '0.62rem 1rem',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '42px',
        },
        hero: {
            minHeight: '92vh',
            padding: '8rem 0 5rem',
            position: 'relative',
            overflow: 'hidden',
        },
        eyebrow: {
            color: palette.active,
            background: '#E8F7FA',
            border: `1px solid ${palette.border}`,
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.8rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
        },
        heroTitle: {
            color: palette.text,
            fontSize: 'clamp(2.45rem, 5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '0',
            marginBottom: '1.35rem',
        },
        heroText: {
            color: palette.muted,
            fontSize: '1.15rem',
            lineHeight: 1.7,
            maxWidth: '610px',
            marginBottom: '2rem',
        },
        primaryButton: {
            background: palette.active,
            color: '#FFFFFF',
            borderRadius: '999px',
            border: 'none',
            padding: '0.95rem 1.3rem',
            fontWeight: 800,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50px',
            boxShadow: '0 16px 34px rgba(79, 179, 200, 0.26)',
        },
        secondaryButton: {
            background: '#FFFFFF',
            color: palette.text,
            borderRadius: '999px',
            border: `1px solid ${palette.border}`,
            padding: '0.95rem 1.3rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50px',
        },
        dashboardShell: {
            background: 'rgba(255, 255, 255, 0.88)',
            border: `1px solid ${palette.border}`,
            borderRadius: '28px',
            boxShadow: '0 26px 80px rgba(36, 52, 71, 0.12)',
            padding: '1.25rem',
            position: 'relative',
            zIndex: 2,
        },
        dashboardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            borderBottom: `1px solid ${palette.border}`,
            paddingBottom: '1rem',
            marginBottom: '1rem',
        },
        dashboardCard: {
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: '18px',
            padding: '1rem',
            minHeight: '142px',
            boxShadow: '0 14px 32px rgba(36, 52, 71, 0.06)',
        },
        section: {
            padding: '5.5rem 0',
        },
        sectionTitle: {
            color: palette.text,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '0',
            marginBottom: '1rem',
        },
        sectionText: {
            color: palette.muted,
            fontSize: '1.05rem',
            lineHeight: 1.7,
        },
        serviceCard: {
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: '8px',
            padding: '1.35rem',
            height: '100%',
            boxShadow: '0 18px 44px rgba(36, 52, 71, 0.06)',
            transition: 'transform 0.24s ease, box-shadow 0.24s ease',
        },
        iconBox: {
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.1rem',
        },
        parallelBand: {
            background: '#E8F7FA',
            border: `1px solid ${palette.border}`,
            borderRadius: '8px',
            padding: '1.35rem',
        },
        academicPanel: {
            background: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: '8px',
            padding: '1.6rem',
            boxShadow: '0 20px 48px rgba(36, 52, 71, 0.07)',
            height: '100%',
        },
        chip: {
            border: `1px solid ${palette.border}`,
            background: '#F9FCFD',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            color: palette.text,
            textDecoration: 'none',
        },
        footer: {
            background: '#FFFFFF',
            borderTop: `1px solid ${palette.border}`,
            padding: '2rem 0',
        },
    };

    return (
        <div style={styles.page}>
            <style>
                {`
                    .landing-soft-orb {
                        position: absolute;
                        border-radius: 999px;
                        filter: blur(2px);
                        opacity: 0.52;
                        animation: landingDrift 9s ease-in-out infinite alternate;
                        pointer-events: none;
                    }

                    .landing-dashboard {
                        animation: landingFloat 7s ease-in-out infinite;
                    }

                    .landing-card-hover:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 24px 54px rgba(36, 52, 71, 0.10);
                    }

                    @keyframes landingFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }

                    @keyframes landingDrift {
                        from { transform: translate3d(0, 0, 0) scale(1); }
                        to { transform: translate3d(18px, -14px, 0) scale(1.05); }
                    }

                    @media (max-width: 991px) {
                        .landing-nav-menu {
                            padding-top: 1rem;
                        }
                    }

                    @media (max-width: 575px) {
                        .landing-hero-actions {
                            width: 100%;
                        }

                        .landing-hero-actions a,
                        .landing-hero-actions button {
                            width: 100%;
                        }
                    }
                `}
            </style>

            <nav className="navbar navbar-expand-lg fixed-top" style={styles.navbar}>
                <div className="container">
                    <a className="navbar-brand fw-bold d-flex align-items-center" href="#inicio" style={styles.brand}>
                        <FaChartLine style={{ color: palette.active, fontSize: '1.2rem' }} className="me-2" />
                        ContaConmigo
                    </a>

                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                        style={{ color: palette.text }}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <div className={`collapse navbar-collapse landing-nav-menu ${menuOpen ? 'show' : ''}`}>
                        <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
                            <button
                                className="nav-link px-0 px-lg-2"
                                type="button"
                                onClick={() => scrollToSection('funcionalidades')}
                                style={styles.navLink}
                            >
                                Funcionalidades
                            </button>
                            <button
                                className="nav-link px-0 px-lg-2"
                                type="button"
                                onClick={() => scrollToSection('trabajo-practico')}
                                style={styles.navLink}
                            >
                                Trabajo practico
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <section id="inicio" style={styles.hero}>
                <span
                    className="landing-soft-orb"
                    style={{ width: '210px', height: '210px', background: palette.brand, right: '7%', top: '18%' }}
                />
                <span
                    className="landing-soft-orb"
                    style={{ width: '140px', height: '140px', background: palette.coral, left: '5%', bottom: '14%', animationDelay: '1.4s' }}
                />

                <div className="container position-relative">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div style={styles.eyebrow}>
                                <FaCheckCircle />
                                Operacion comercial + contabilidad
                            </div>
                            <h1 style={styles.heroTitle}>
                                Gestiona ventas, productos, clientes y contabilidad en un solo sistema.
                            </h1>
                            <p style={styles.heroText}>
                                ContaConmigo conecta la actividad diaria del negocio con sus registros contables,
                                para que cada venta, cliente y producto tenga respaldo administrativo.
                            </p>
                            <div className="d-flex flex-wrap gap-3 landing-hero-actions">
                                <a href="/login" style={styles.primaryButton}>
                                    Iniciar sesion
                                </a>
                                <button
                                    type="button"
                                    style={styles.secondaryButton}
                                    onClick={() => scrollToSection('funcionalidades')}
                                >
                                    Ver funcionalidades
                                </button>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="landing-dashboard" style={styles.dashboardShell} aria-label="Resumen visual de ContaConmigo">
                                <div style={styles.dashboardHeader}>
                                    <div>
                                        <div style={{ color: palette.muted, fontSize: '0.85rem', fontWeight: 700 }}>
                                            Panel integrado
                                        </div>
                                        <div style={{ color: palette.text, fontSize: '1.25rem', fontWeight: 800 }}>
                                            Gestion en paralelo
                                        </div>
                                    </div>
                                    <div style={{
                                        background: '#ECF8F1',
                                        color: '#3E7B58',
                                        borderRadius: '999px',
                                        padding: '0.45rem 0.7rem',
                                        fontWeight: 800,
                                        fontSize: '0.82rem',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        Sincronizado
                                    </div>
                                </div>

                                <div className="row g-3">
                                    {dashboardItems.map((item) => (
                                        <div className="col-sm-6" key={item.label}>
                                            <div style={styles.dashboardCard}>
                                                <div style={{ color: item.color, fontWeight: 800, marginBottom: '0.6rem' }}>
                                                    {item.label}
                                                </div>
                                                <div style={{ color: palette.text, fontSize: '2rem', fontWeight: 850, lineHeight: 1 }}>
                                                    {item.value}
                                                </div>
                                                <div style={{ color: palette.muted, fontSize: '0.9rem', marginTop: '0.55rem' }}>
                                                    {item.detail}
                                                </div>
                                                <div style={{
                                                    height: '8px',
                                                    background: '#EEF6F8',
                                                    borderRadius: '999px',
                                                    marginTop: '1rem',
                                                    overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        width: item.label === 'Contabilidad' ? '100%' : '72%',
                                                        height: '100%',
                                                        background: item.color,
                                                        borderRadius: '999px',
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    marginTop: '1rem',
                                    border: `1px dashed ${palette.border}`,
                                    borderRadius: '18px',
                                    padding: '0.9rem 1rem',
                                    color: palette.muted,
                                    background: '#FBFEFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                }}>
                                    <FaBook style={{ color: palette.active, flex: '0 0 auto' }} />
                                    Los datos comerciales se guardan junto a la informacion contable.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="funcionalidades" style={{ ...styles.section, background: '#FFFFFF' }}>
                <div className="container">
                    <div className="row justify-content-center text-center mb-5">
                        <div className="col-lg-7">
                            <h2 style={styles.sectionTitle}>Una app para administrar el circuito completo</h2>
                            <p style={styles.sectionText}>
                                Las herramientas principales de ContaConmigo cubren ventas, productos,
                                clientes y contabilidad sin separar la gestion diaria de los libros.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        {services.map((service) => {
                            const Icon = service.icon;

                            return (
                                <div className="col-md-6 col-lg-4" key={service.title}>
                                    <article className="landing-card-hover" style={styles.serviceCard}>
                                        <div style={{ ...styles.iconBox, background: service.background }}>
                                            <Icon size={22} style={{ color: service.color }} />
                                        </div>
                                        <h3 style={{ color: palette.text, fontSize: '1.18rem', fontWeight: 800, marginBottom: '0.7rem' }}>
                                            {service.title}
                                        </h3>
                                        <p style={{ color: palette.muted, lineHeight: 1.65, margin: 0 }}>
                                            {service.description}
                                        </p>
                                    </article>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4" style={styles.parallelBand}>
                        <div className="row align-items-center g-3">
                            <div className="col-lg-8">
                                <h3 style={{ color: palette.text, fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                                    Gestion comercial y contabilidad guardadas en paralelo
                                </h3>
                                <p style={{ color: palette.muted, margin: 0, lineHeight: 1.6 }}>
                                    Las ventas, los clientes y los productos conviven con la informacion contable,
                                    dando una mirada administrativa completa del sistema.
                                </p>
                            </div>
                            <div className="col-lg-4">
                                <div className="d-flex flex-wrap justify-content-lg-end gap-2">
                                    {['Ventas', 'Clientes', 'Productos', 'Libros'].map((item) => (
                                        <span
                                            key={item}
                                            style={{
                                                background: palette.surface,
                                                color: palette.text,
                                                border: `1px solid ${palette.border}`,
                                                borderRadius: '999px',
                                                padding: '0.45rem 0.75rem',
                                                fontWeight: 700,
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="trabajo-practico" style={styles.section}>
                <div className="container">
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-5">
                            <div style={styles.academicPanel}>
                                <div style={styles.eyebrow}>
                                    <FaBook />
                                    Sistemas Administrativos
                                </div>
                                <h2 style={styles.sectionTitle}>Trabajo practico academico</h2>
                                <p style={styles.sectionText}>
                                    ContaConmigo fue desarrollado como trabajo practico de la materia
                                    Sistemas Administrativos, integrando una aplicacion React con backend
                                    Spring Boot y base de datos PostgreSQL.
                                </p>
                                <div style={{ color: palette.text, fontWeight: 800, marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                                    Autores
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {['Nico Alfaro', 'Mirko Sandrk'].map((author) => (
                                        <span
                                            key={author}
                                            style={{
                                                background: '#E8F7FA',
                                                color: palette.text,
                                                border: `1px solid ${palette.border}`,
                                                borderRadius: '999px',
                                                padding: '0.5rem 0.8rem',
                                                fontWeight: 800,
                                            }}
                                        >
                                            {author}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div style={styles.academicPanel}>
                                <h3 style={{ color: palette.text, fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>
                                    Stack y repositorios
                                </h3>
                                <div className="row g-3 mb-4">
                                    {techItems.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <div className="col-md-4" key={item.label}>
                                                <div style={styles.chip}>
                                                    <Icon style={{ color: palette.active, flex: '0 0 auto' }} />
                                                    <div>
                                                        <div style={{ color: palette.muted, fontSize: '0.78rem', fontWeight: 700 }}>
                                                            {item.label}
                                                        </div>
                                                        <div style={{ color: palette.text, fontWeight: 850 }}>
                                                            {item.value}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="d-grid gap-3">
                                    {repoItems.map((repo) => (
                                        <a
                                            href={repo.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={styles.chip}
                                            key={repo.value}
                                        >
                                            <FaCodeBranch style={{ color: palette.green, flex: '0 0 auto' }} />
                                            <div>
                                                <div style={{ color: palette.muted, fontSize: '0.78rem', fontWeight: 700 }}>
                                                    {repo.label}
                                                </div>
                                                <div style={{ color: palette.text, fontWeight: 850, wordBreak: 'break-word' }}>
                                                    {repo.value}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={styles.footer}>
                <div className="container">
                    <div className="row align-items-center g-3">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center">
                                <FaChartLine style={{ color: palette.active, fontSize: '1.15rem' }} className="me-2" />
                                <span style={{ color: palette.text, fontWeight: 800, fontSize: '1.05rem' }}>
                                    ContaConmigo
                                </span>
                            </div>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p style={{ color: palette.muted, margin: 0, fontSize: '0.92rem' }}>
                                © 2026 ContaConmigo. Trabajo practico de Sistemas Administrativos.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
