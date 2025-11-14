import React from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
const PLAN_DE_CUENTAS_BASE_REST_API_URL = "${API_BASE_URL}/accounts";

class PlanDeCuentasServicio {

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (token) {
            return {
                headers: {
                    'Authorization': token
                }
            };
        }
        return {}; // Devuelve un objeto vacío si no hay token
    }

    listarCuentas() {
        return axios.get(PLAN_DE_CUENTAS_BASE_REST_API_URL, this.getAuthHeaders());
    }

    getCuentaById(cuentaId) {
        return axios.get(PLAN_DE_CUENTAS_BASE_REST_API_URL + '/' + cuentaId, this.getAuthHeaders());
    }
    
    //Retorna el saldo de la funcion calcular saldo de cada cuenta
    getSaldoCuenta(cuentaId) {
        return axios.get(PLAN_DE_CUENTAS_BASE_REST_API_URL + '/getbalance/' + cuentaId, this.getAuthHeaders());
    }
    getResultado() {
        return axios.get(PLAN_DE_CUENTAS_BASE_REST_API_URL + '/results', this.getAuthHeaders());
    }
    getPatrimonio() {
        return axios.get(PLAN_DE_CUENTAS_BASE_REST_API_URL + '/equity', this.getAuthHeaders());
    }

    crearCuentaControl(account) {
        return axios.post(PLAN_DE_CUENTAS_BASE_REST_API_URL + '/control', account, this.getAuthHeaders());
    }
    crearCuentaControlId(account, id) {
        const config = this.getAuthHeaders();
        config.params = { id: id };

        return axios.post(PLAN_DE_CUENTAS_BASE_REST_API_URL + '/control', account, config);
    }
    crearCuentaBalance(account, id) {
        const config = this.getAuthHeaders();
        config.params = { id: id };
        return axios.post(PLAN_DE_CUENTAS_BASE_REST_API_URL + '/balance', account, config);
    }

    modificarCuenta(cuentaId, name){
        return axios.put(PLAN_DE_CUENTAS_BASE_REST_API_URL + '/' + cuentaId + '?name=' + name, null, this.getAuthHeaders());
    }

    getBalanceAccounts() {
        return axios.get(PLAN_DE_CUENTAS_BASE_REST_API_URL + "/balance", this.getAuthHeaders());
    }

    // CORREGIDO y como función flecha
    desactivarCuenta = (cuentaId) => {
        return axios.delete(PLAN_DE_CUENTAS_BASE_REST_API_URL + "/delete/" + cuentaId, this.getAuthHeaders());
    }
    
    // CORREGIDO (añadido 'null') y como función flecha
    activarCuenta = (cuentaId) => {
        return axios.put(PLAN_DE_CUENTAS_BASE_REST_API_URL + "/activate/" + cuentaId, null, this.getAuthHeaders());
    }



}

export default new PlanDeCuentasServicio();
