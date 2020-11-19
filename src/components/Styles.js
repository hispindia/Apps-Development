import styled from 'styled-components';

export const MainContainer = styled.div`
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-column-gap: 10px; 
    padding-top:10px;
`
export const Box = styled.div`
    border-radius: 0.25rem;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
`
export const Aside = styled(Box)`
    max-height: 785px;
    overflow-y: auto;
`
export const Section = styled(Box)`
    padding: 0px 10px;
`
export const CenterItem = styled.div`
    text-align: center;
    padding-top: 1em;
`
export const Item = styled.div`
    display:flex;
    padding-top:1em;
`
export const Label = styled.div`
    width:30%;
    float:left;
`
export const Category = styled.div`
    width:70%;
    float:left;
`
export const CenterLoader = styled.section`
    position:fixed;
    top:40%;
    left:50%;
    height:700px;
    width:100%;  
`
export const Container = styled.section`
    width="100%"
    height="570"
    style={{border: "1px solid #ddd", }}
`
