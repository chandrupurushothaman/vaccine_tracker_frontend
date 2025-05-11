import React, { useEffect } from 'react';
import { Grid, Icon, Paper, Typography } from '@mui/material';
import { Groups as GroupsIcon, MedicalServices as MedicalServicesIcon, Summarize as SummarizeIcon } from '@mui/icons-material';
import './Dashboard.css';
import UpcomingVaccinations from '../components/UpcomingVaccinations';
import VaccinationDetailsModal from '../components/VaccinationDetailsModal';
import { _get } from '../api/client';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = React.useState({});
    const [selectedVaccine, setSelectedVaccine] = React.useState(null);
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleVaccineClick = (vaccine) => {
        setSelectedVaccine(vaccine);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const getDashboardData = async () => {
        if (dashboardData && Object.keys(dashboardData).length > 0) {
            return;
        }
        await _get('/dashboard', {})
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Failed to fetch data');
                }
                const resp = res.data;
                if (resp) {
                    setDashboardData(resp);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getDashboardData();
    }, []);

    return (
        <div>
            <Grid container direction={"column"} spacing={4} style={{ padding: 30 }}>
                <Grid container spacing={6} justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={8} md={5}>
                        <Paper elevation={6} style={{ padding: 30, textAlign: 'center', borderRadius: 16, minHeight: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon className='student icon' style={{ fontSize: 60, marginBottom: 16 }}>
                                <GroupsIcon fontSize="inherit" />
                            </Icon>
                            <Typography sx={{ opacity: 0.6, fontSize: '1.25rem', marginBottom: 2 }}>Total number of students</Typography>
                            <Typography className='count' style={{ fontSize: '4.5rem' }}>{dashboardData?.student_count || 0}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8} md={5}>
                        <Paper elevation={6} style={{ padding: 30, textAlign: 'center', borderRadius: 16, minHeight: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon className='vaccinated icon' style={{ fontSize: 60, marginBottom: 16 }}>
                                <MedicalServicesIcon fontSize="inherit" />
                            </Icon>
                            <Typography sx={{ opacity: 0.6, fontSize: '1.25rem', marginBottom: 2 }}>Number of students vaccinated</Typography>
                            <Typography className='count' style={{ fontSize: '4.5rem' }}>{dashboardData?.vaccinated_count || 0}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8} md={5}>
                        <Paper elevation={6} style={{ padding: 30, textAlign: 'center', borderRadius: 16, minHeight: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon className='percentage icon' style={{ fontSize: 60, marginBottom: 16 }}>
                                <SummarizeIcon fontSize="inherit" />
                            </Icon>
                            <Typography sx={{ opacity: 0.6, fontSize: '1.25rem', marginBottom: 2 }}>Percentage of students vaccinated</Typography>
                            <Typography className='count' style={{ fontSize: '4.5rem' }}>{dashboardData?.vaccinated_percentage || 0}%</Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container justifyContent="left">
                    <Grid item xs={12} md={7} lg={5}>
                        <Paper elevation={6} style={{ width: '100%', textAlign: 'start', borderRadius: 16, marginTop: 30, padding: 30 }}>
                            <div>
                                <Typography sx={{ opacity: 0.6, fontSize: '1.25rem', marginBottom: 2 }}>Upcoming Vaccination Drives</Typography>
                                <UpcomingVaccinations
                                    upcomingDrives={dashboardData?.upcoming_drives || []}
                                    onVaccineClick={handleVaccineClick}
                                />
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <VaccinationDetailsModal
                open={modalOpen}
                handleClose={handleCloseModal}
                vaccination={selectedVaccine}
            />
        </div>
    );
};

export default Dashboard;

