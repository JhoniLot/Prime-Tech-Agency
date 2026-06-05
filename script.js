document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. HEADER NAVIGATION & MOBILE MENU
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Toggle header background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        // Toggle icon between hamburger and close
        const isOpened = navLinksContainer.classList.contains('active');
        mobileMenuBtn.innerHTML = isOpened 
            ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
            : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            mobileMenuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        });
    });


    /* ==========================================================================
       2. ROI INTERACTIVE CALCULATOR
       ========================================================================== */
    const inputTicket = document.getElementById('ticket-medio');
    const inputVendas = document.getElementById('vendas-mes');
    const inputOrcamento = document.getElementById('orcamento-anuncios');

    const lblTicket = document.getElementById('lbl-ticket');
    const lblVendas = document.getElementById('lbl-vendas');
    const lblOrcamento = document.getElementById('lbl-orcamento');

    const lblFaturamentoExtra = document.getElementById('lbl-faturamento-extra');
    const lblRoiCalc = document.getElementById('lbl-roi-calc');

    // Formatting helper
    function formatCurrencyBR(value) {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function calculateROI() {
        const ticketVal = parseFloat(inputTicket.value);
        const vendasVal = parseInt(inputVendas.value);
        const orcamentoVal = parseFloat(inputOrcamento.value);

        // Update Slider Label Displays
        lblTicket.textContent = formatCurrencyBR(ticketVal);
        lblVendas.textContent = vendasVal;
        lblOrcamento.textContent = formatCurrencyBR(orcamentoVal);

        /* 
           ROI CALCULATION FORMULA (Realistic & Transparent)
           - Dynamic Cost Per Lead (CPL) is assumed to range around R$ 25.00 for target sectors (lawyers/B2B/finance).
           - Conversion rate from lead to closed sales is estimated at 6% (average conservative closing rate).
           - Total Leads generated = Budget / CPL
           - Projected New Sales = Leads * Conversion Rate (6%)
           - Extra Revenue = New Sales * Ticket Medio
           - ROI = Extra Revenue / Budget
        */
        const cpl = 25; // CPL benchmark
        const conversionRate = 0.06; // lead -> sale conversion rate (6%)

        const projectedLeads = orcamentoVal / cpl;
        const projectedNewSales = Math.max(1, Math.round(projectedLeads * conversionRate));
        const additionalRevenue = projectedNewSales * ticketVal;
        const roiResult = additionalRevenue / orcamentoVal;

        // Display results
        lblFaturamentoExtra.textContent = formatCurrencyBR(additionalRevenue);
        lblRoiCalc.textContent = roiResult.toFixed(1) + 'x';

        // Apply a visual green indicator if ROI is high
        if (roiResult >= 5) {
            lblRoiCalc.className = 'res-value text-green';
        } else {
            lblRoiCalc.className = 'res-value';
        }
    }

    // Set listeners for sliders
    if (inputTicket && inputVendas && inputOrcamento) {
        inputTicket.addEventListener('input', calculateROI);
        inputVendas.addEventListener('input', calculateROI);
        inputOrcamento.addEventListener('input', calculateROI);
        
        // Initial run to set values
        calculateROI();
    }


    /* ==========================================================================
       3. CONTACT FORM SUBMISSION
       ========================================================================== */
    const leadForm = document.getElementById('lead-form');
    const successMessage = document.getElementById('success-message');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input values for custom actions or analytics
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const email = document.getElementById('email').value;
            const segment = document.getElementById('segment').value;
            const budget = document.getElementById('budget').value;

            // Submit using FormSubmit AJAX
            fetch("https://formsubmit.co/ajax/3d1335e6edbd2bf554ab768de064ca31", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Nome: name,
                    Empresa: company,
                    WhatsApp: whatsapp,
                    Email: email,
                    Segmento: segment,
                    Orcamento: budget
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Perform visual transitions: hide form fields and show success panel
                leadForm.classList.add('hide');
                
                const whatsappBox = document.querySelector('.whatsapp-cta-box');
                const separator = document.querySelector('.form-separator');
                if (whatsappBox) whatsappBox.classList.add('hide');
                if (separator) separator.classList.add('hide');
                
                successMessage.classList.remove('hide');
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            })
            .catch((error) => {
                console.error('Error:', error);
                // Fail-safe: display success screen so the user doesn't feel blocked
                leadForm.classList.add('hide');
                const whatsappBox = document.querySelector('.whatsapp-cta-box');
                const separator = document.querySelector('.form-separator');
                if (whatsappBox) whatsappBox.classList.add('hide');
                if (separator) separator.classList.add('hide');
                successMessage.classList.remove('hide');
            });
        });
    }
});
