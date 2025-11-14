import React, { useState } from 'react';
import { FaChartLine, FaFileInvoiceDollar, FaUserShield, FaCloudUploadAlt, FaCheck, FaBars, FaTimes } from 'react-icons/fa';

const LandingPage = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMenuOpen(false);
        }
    };

    const styles = {
        navbar: {
            background: '#FFFFFF',
            borderBottom: '1px solid #E8E8E8',
            padding: '0.50rem 0'
        },
        hero: {
            background: 'linear-gradient(135deg, #F5E6E8 0%, #E8F4F8 100%)',
            paddingTop: '100px',
            paddingBottom: '80px',
            minHeight: '90vh'
        },
        card: {
            borderRadius: '20px',
            border: 'none',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        },
        iconWrapper: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            transition: 'transform 0.3s ease'
        },
        button: {
            borderRadius: '30px',
            padding: '12px 32px',
            fontWeight: '500',
            border: 'none',
            transition: 'all 0.3s ease'
        },
        featureCard: {
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '2rem',
            height: '100%',
            border: '1px solid #F0F0F0',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        },
        pricingCard: {
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '2.5rem',
            border: '1px solid #F0F0F0',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        },
        footer: {
            background: '#F8F9FA',
            padding: '2rem 0'
        }
    };

    return (
        <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg fixed-top" style={styles.navbar}>
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#home" style={{ color: '#2C3E50', fontSize: '1.5rem' }}>
                        <FaChartLine style={{ color: '#A8DADC', fontSize: '1.25rem' }} className="me-2" />
                        ContaConmigo
                    </a>
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                        style={{ color: '#2C3E50' }}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    {/*<div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#inicio" onClick={() => scrollToSection('inicio')}
                                   style={{color: '#5A6C7D', fontWeight: '500'}}>Inicio</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#caracteristicas"
                                   onClick={() => scrollToSection('caracteristicas')}
                                   style={{color: '#5A6C7D', fontWeight: '500'}}>Características</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login" style={{color: '#5A6C7D', fontWeight: '500'}}>Iniciar
                                    Sesion</a>
                            </li>
                        </ul>
                    </div>*/}
                </div>
            </nav>

            {/* Hero Section */}
            <section id="inicio" style={styles.hero}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div style={{ maxWidth: '500px' }}>
                                <h1 style={{ fontSize: '3.5rem', fontWeight: '700', color: '#2C3E50', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                                    Simplifica la gestion financiera de tu negocio.
                                </h1>
                                <p style={{ fontSize: '1.25rem', color: '#5A6C7D', marginBottom: '2rem', lineHeight: '1.6' }}>
                                    Reportes y analisis en tiempo real, todo en un solo lugar
                                </p>
                                <div>
                                    <a href="/login">
                                        <button
                                            style={{
                                                ...styles.button,
                                                background: '#A8DADC',
                                                color: '#2C3E50',
                                                marginRight: '1rem',
                                                marginBottom: '1rem'
                                            }}
                                            className="btn btn-lg"
                                        >
                                            Iniciar Sesion
                                        </button>
                                    </a>
                                    <button

                                        style={{
                                            ...styles.button,
                                            background: 'transparent',
                                            color: '#2C3E50',
                                            border: '2px solid #E8E8E8',
                                            marginBottom: '1rem'
                                        }}
                                        className="btn btn-lg"
                                        onClick={() => scrollToSection('caracteristicas')}
                                    >
                                        Caracteristicas
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div style={{
                                background: '#FFFFFF',
                                borderRadius: '30px',
                                padding: '2rem',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                                    alt="Dashboard"
                                    style={{ width: '100%', borderRadius: '20px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="caracteristicas" style={{ padding: '6rem 0', background: '#FFFFFF' }}>
                <div className="container">
                    <div className="text-center mb-5" style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2C3E50', marginBottom: '1rem' }}>
                            Todo lo que necesitás
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: '#5A6C7D' }}>
                            Herramientas diseñadas para simplificar tu trabajo diario
                        </p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                            <div
                                style={styles.featureCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ ...styles.iconWrapper, background: '#FFE5E5' }}>
                                    <FaFileInvoiceDollar size={32} style={{ color: '#FF9999' }} />
                                </div>
                                <h5 style={{ color: '#2C3E50', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>
                                    Contabilidad
                                </h5>
                                <p style={{ color: '#5A6C7D', textAlign: 'center', lineHeight: '1.6', margin: 0 }}>
                                    Virtualiza tus libros contables
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div
                                style={styles.featureCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ ...styles.iconWrapper, background: '#E8F4F8' }}>
                                    <FaChartLine size={32} style={{ color: '#A8DADC' }} />
                                </div>
                                <h5 style={{ color: '#2C3E50', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>
                                    Reportes
                                </h5>
                                <p style={{ color: '#5A6C7D', textAlign: 'center', lineHeight: '1.6', margin: 0 }}>
                                    Análisis visual de tus finanzas
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div
                                style={styles.featureCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ ...styles.iconWrapper, background: '#FFF4E6' }}>
                                    <FaUserShield size={32} style={{ color: '#FFD4A3' }} />
                                </div>
                                <h5 style={{ color: '#2C3E50', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>
                                    Seguridad
                                </h5>
                                <p style={{ color: '#5A6C7D', textAlign: 'center', lineHeight: '1.6', margin: 0 }}>
                                    Seguridad y integridad para tus datos
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div
                                style={styles.featureCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ ...styles.iconWrapper, background: '#F0E6FF' }}>
                                    <FaCloudUploadAlt size={32} style={{ color: '#C4A7E7' }} />
                                </div>
                                <h5 style={{ color: '#2C3E50', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>
                                    En la nube
                                </h5>
                                <p style={{ color: '#5A6C7D', textAlign: 'center', lineHeight: '1.6', margin: 0 }}>
                                    Accedé desde cualquier dispositivo
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={styles.footer}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-2 mb-md-0">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaChartLine style={{ color: '#A8DADC', fontSize: '1.25rem' }} className="me-2" />
                                <span style={{ color: '#2C3E50', fontWeight: '600', fontSize: '1.1rem' }}>ContaConmigo</span>
                            </div>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p style={{ color: '#5A6C7D', margin: 0, fontSize: '0.9rem' }}>© 2025 ContaConmigo. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Bootstrap CSS */}
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                rel="stylesheet"
            />
        </div>
    );
};

export default LandingPage;