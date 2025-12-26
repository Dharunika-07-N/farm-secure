"""
Synthetic Farm Data Generator for SIH 2025
Generates realistic farm data calibrated to actual research statistics from:
- Northeast India Pig Farm Biosecurity Survey (1,000 farms)
- Tamil Nadu Poultry Biosecurity Training Study (89 farms)
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import json

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

class FarmDataGenerator:
    def __init__(self):
        # Load real survey data
        self.ne_india_data = pd.read_csv('data/raw/ne_india_biosecurity_survey.csv')
        self.tn_poultry_data = pd.read_csv('data/raw/tn_poultry_biosecurity_training.csv')
        
        # Indian states with pig/poultry farming
        self.pig_states = [
            'Nagaland', 'Mizoram', 'Meghalaya', 'Assam', 'Manipur', 
            'Tripura', 'Arunachal Pradesh', 'West Bengal', 'Jharkhand', 'Bihar'
        ]
        
        self.poultry_states = [
            'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Karnataka', 
            'Maharashtra', 'West Bengal', 'Haryana', 'Punjab', 'Uttar Pradesh'
        ]
        
        # Disease types
        self.pig_diseases = ['ASF', 'CSF', 'FMD', 'Swine Flu', 'PPR']
        self.poultry_diseases = ['Avian Influenza', 'Newcastle Disease', 'Ranikhet', 'Marek\'s Disease']
        
    def calculate_biosecurity_score(self, farm_type, district_type='urban'):
        """Calculate biosecurity score based on real survey data"""
        if farm_type == 'pig':
            # Based on NE India survey - poor biosecurity is the norm
            base_score = np.random.normal(35, 15)  # Mean 35/100, very poor
            
            if district_type == 'urban':
                base_score += 10  # Urban farms slightly better
            
            # Apply specific factors from survey
            factors = {
                'has_fencing': random.random() < 0.069,  # 6.9% have fencing
                'has_footbath': random.random() < 0.007,  # 0.7% have footbath
                'restricted_access': random.random() < 0.172,  # 17.2% restrict access
                'quarantine_sick': random.random() < 0.02,  # 2% quarantine sick
                'regular_cleaning': random.random() < 0.64,  # 64% clean regularly
                'uses_disinfectant': random.random() < 0.10,  # 10% use disinfectant
                'safe_disposal': random.random() < 0.15,  # 15% safe disposal
                'changes_clothes': random.random() < 0.10,  # 10% change clothes
                'record_keeping': random.random() < 0.036,  # 3.6% keep records
            }
            
            # Adjust score based on factors
            for factor, has_it in factors.items():
                if has_it:
                    base_score += random.uniform(5, 10)
                    
        else:  # poultry
            # Based on TN training study - better compliance after training
            base_score = np.random.normal(65, 18)  # Mean 65/100, moderate
            
            # Apply specific factors from TN study
            factors = {
                'farm_fencing': random.random() < 0.55,  # 55% avg full adoption
                'foot_bath': random.random() < 0.48,  # 48% avg
                'chlorinated_water': random.random() < 0.82,  # 82% avg (high!)
                'disease_isolation': random.random() < 0.55,  # 55% avg
                'antibiotic_vet': random.random() < 0.62,  # 62% avg
                'dead_bird_disposal': random.random() < 0.57,  # 57% avg
            }
            
            for factor, has_it in factors.items():
                if has_it:
                    base_score += random.uniform(3, 8)
        
        # Ensure score is between 0-100
        return max(0, min(100, base_score))
    
    def generate_pig_farm(self, farm_id, state):
        """Generate a single pig farm based on NE India survey data"""
        district_type = random.choice(['urban', 'rural'])
        
        # Get reference data from survey
        if district_type == 'urban':
            ref_data = self.ne_india_data[self.ne_india_data['district_type'] == 'urban'].iloc[0]
        else:
            ref_data = self.ne_india_data[self.ne_india_data['district_type'] == 'rural'].iloc[0]
        
        # Generate farm details
        farm = {
            'farm_id': f'PIG-{farm_id:04d}',
            'farm_name': f'{state} Pig Farm {farm_id}',
            'farm_type': 'pig',
            'state': state,
            'district_type': district_type,
            'latitude': round(random.uniform(23.0, 29.0), 6),  # NE India range
            'longitude': round(random.uniform(88.0, 97.0), 6),
            
            # Owner demographics (from survey)
            'owner_age': int(np.random.normal(50.51, 12)),
            'owner_gender': 'Male' if random.random() < 0.795 else 'Female',
            'education_level': self._get_education_level(ref_data),
            'primary_activity': 'Mixed Farming' if random.random() < (ref_data['mixed_farming_percent']/100) else 'Pig Rearing',
            'house_type': 'Kutcha' if random.random() < (ref_data['kutcha_houses_percent']/100) else 'Concrete',
            'has_training': random.random() > (ref_data['no_training_percent']/100),
            
            # Farm characteristics
            'pig_population': int(np.random.normal(ref_data['avg_pig_population'], 2)),
            'purpose': 'Fattening' if random.random() < (ref_data['fattening_purpose_percent']/100) else 'Breeding',
            'breed': 'Crossbred' if district_type == 'urban' and random.random() < 0.75 else 'Local',
            'pen_type': 'Concrete' if district_type == 'urban' and random.random() < 0.68 else 'Wood',
            'pen_location': self._get_pen_location(district_type),
            
            # Management practices
            'swill_feeding': random.random() < (ref_data['swill_feeding_percent']/100),
            'wild_boar_hunting': random.random() < (ref_data['wild_boar_hunting_percent']/100),
            'asf_awareness': random.random() < (ref_data['asf_awareness_percent']/100),
            'purchased_last_year': random.random() < (ref_data['purchased_pigs_percent']/100),
            'sold_last_year': random.random() < (ref_data['sold_pigs_percent']/100),
            
            # Biosecurity score
            'biosecurity_score': round(self.calculate_biosecurity_score('pig', district_type), 2),
            
            # Disease history (from survey prevalence)
            'had_inappetence': random.random() < 0.784,
            'had_diarrhea': random.random() < 0.712,
            'had_skin_rashes': random.random() < 0.557,
            'adult_deaths_last_year': int(np.random.poisson(0.231 * 3)),  # Avg deaths
            'grower_deaths_last_year': int(np.random.poisson(0.472 * 3)),
            'piglet_deaths_last_year': int(np.random.poisson(0.182 * 3)),
            
            # Risk assessment
            'risk_level': None,  # Will be calculated
            'last_inspection': self._random_date_last_year(),
            'created_at': datetime.now().isoformat(),
        }
        
        # Calculate risk level
        farm['risk_level'] = self._calculate_risk_level(farm)
        
        return farm
    
    def generate_poultry_farm(self, farm_id, state):
        """Generate a single poultry farm based on TN training study"""
        farm_types = ['commercial_desi', 'commercial_broiler', 'commercial_layer']
        farm_type = random.choice(farm_types)
        
        # Get reference data
        ref_data = self.tn_poultry_data[self.tn_poultry_data['farm_type'] == farm_type].iloc[0]
        
        farm = {
            'farm_id': f'POULTRY-{farm_id:04d}',
            'farm_name': f'{state} Poultry Farm {farm_id}',
            'farm_type': 'poultry',
            'poultry_category': farm_type.replace('commercial_', ''),
            'state': state,
            'latitude': round(random.uniform(8.0, 13.5), 6),  # South India range
            'longitude': round(random.uniform(76.0, 80.0), 6),
            
            # Owner demographics
            'owner_age': self._get_age_group(ref_data),
            'owner_gender': 'Male' if random.random() < 0.888 else 'Female',
            'education_level': self._get_education_level_poultry(ref_data),
            'primary_activity': 'Poultry + Agriculture' if random.random() < 0.461 else 'Poultry Only',
            'land_holding': 'Small/Medium' if random.random() < 0.843 else 'Large',
            'experience_years': self._get_experience_years(ref_data),
            
            # Farm characteristics
            'bird_population': self._get_bird_population(farm_type),
            'farm_size_category': 'Under 25k' if random.random() < 0.933 else '25k-100k',
            
            # Biosecurity score (post-training)
            'biosecurity_score': round(self.calculate_biosecurity_score('poultry'), 2),
            'received_training': True,  # All farms in study received training
            
            # Biosecurity practices (based on adoption rates)
            'has_farm_fencing': self._check_adoption(ref_data, 'farm_fencing'),
            'has_restricted_entry': self._check_adoption(ref_data, 'restricted_entry'),
            'has_foot_vehicle_bath': self._check_adoption(ref_data, 'foot_vehicle_bath'),
            'proper_stocking_density': self._check_adoption(ref_data, 'stocking_density'),
            'uses_chlorinated_water': self._check_adoption(ref_data, 'chlorinated_water'),
            'isolates_sick_birds': self._check_adoption(ref_data, 'disease_isolation'),
            'vet_antibiotic_use': self._check_adoption(ref_data, 'antibiotic_vet'),
            'proper_manure_disposal': self._check_adoption(ref_data, 'manure_disposal'),
            'proper_dead_bird_disposal': self._check_adoption(ref_data, 'dead_bird_disposal'),
            'wild_bird_control': self._check_adoption(ref_data, 'wild_bird_control'),
            
            # Risk assessment
            'risk_level': None,
            'last_inspection': self._random_date_last_year(),
            'created_at': datetime.now().isoformat(),
        }
        
        farm['risk_level'] = self._calculate_risk_level(farm)
        
        return farm
    
    def _get_education_level(self, ref_data):
        """Get education level based on survey distribution"""
        rand = random.random()
        if rand < (ref_data['illiterate_percent']/100):
            return 'Illiterate'
        elif rand < (ref_data['primary_education_percent']/100):
            return 'Primary'
        else:
            return 'Secondary'
    
    def _get_education_level_poultry(self, ref_data):
        """Get education level for poultry farmers"""
        rand = random.random()
        if rand < 0.011:
            return 'No Formal Education'
        elif rand < 0.123:
            return 'Primary'
        elif rand < 0.539:
            return 'Secondary'
        else:
            return 'Tertiary'
    
    def _get_pen_location(self, district_type):
        """Get pen location based on district type"""
        if district_type == 'urban':
            return random.choice(['Isolated Roadside', 'Commune Roadside', 'Isolated Interior'])
        else:
            return random.choice(['Commune Roadside', 'Isolated Interior', 'Commune Interior'])
    
    def _get_age_group(self, ref_data):
        """Get age based on distribution"""
        rand = random.random()
        if rand < 0.483:
            return random.randint(21, 40)
        elif rand < 0.899:
            return random.randint(41, 60)
        else:
            return random.randint(61, 75)
    
    def _get_experience_years(self, ref_data):
        """Get farming experience years"""
        rand = random.random()
        if rand < 0.27:
            return random.randint(1, 4)
        elif rand < 0.832:
            return random.randint(5, 20)
        else:
            return random.randint(21, 40)
    
    def _get_bird_population(self, farm_type):
        """Get bird population based on farm type"""
        if farm_type == 'commercial_layer':
            return int(np.random.normal(15000, 5000))
        elif farm_type == 'commercial_broiler':
            return int(np.random.normal(10000, 4000))
        else:  # commercial_desi
            return int(np.random.normal(5000, 2000))
    
    def _check_adoption(self, ref_data, practice):
        """Check if farm adopted a biosecurity practice"""
        full_adoption_rate = ref_data[f'{practice}_full_adoption'] / 100
        partial_adoption_rate = ref_data[f'{practice}_partial_adoption'] / 100
        
        rand = random.random()
        if rand < full_adoption_rate:
            return 'Full'
        elif rand < (full_adoption_rate + partial_adoption_rate):
            return 'Partial'
        else:
            return 'None'
    
    def _random_date_last_year(self):
        """Generate random date in last year"""
        days_ago = random.randint(1, 365)
        date = datetime.now() - timedelta(days=days_ago)
        return date.strftime('%Y-%m-%d')
    
    def _calculate_risk_level(self, farm):
        """Calculate risk level based on biosecurity score and other factors"""
        score = farm['biosecurity_score']
        
        # Base risk from biosecurity score
        if score < 30:
            risk = 'Critical'
        elif score < 50:
            risk = 'High'
        elif score < 70:
            risk = 'Medium'
        else:
            risk = 'Low'
        
        # Adjust for specific risk factors
        if farm['farm_type'] == 'pig':
            if not farm['asf_awareness']:
                risk = self._increase_risk(risk)
            if farm['wild_boar_hunting']:
                risk = self._increase_risk(risk)
            if farm['swill_feeding']:
                risk = self._increase_risk(risk)
        
        return risk
    
    def _increase_risk(self, current_risk):
        """Increase risk level by one notch"""
        risk_levels = ['Low', 'Medium', 'High', 'Critical']
        current_index = risk_levels.index(current_risk)
        return risk_levels[min(current_index + 1, 3)]
    
    def generate_dataset(self, num_pig_farms=600, num_poultry_farms=400):
        """Generate complete synthetic dataset"""
        print(f"Generating {num_pig_farms} pig farms and {num_poultry_farms} poultry farms...")
        
        farms = []
        
        # Generate pig farms
        for i in range(num_pig_farms):
            state = random.choice(self.pig_states)
            farm = self.generate_pig_farm(i+1, state)
            farms.append(farm)
            
            if (i+1) % 100 == 0:
                print(f"  Generated {i+1} pig farms...")
        
        # Generate poultry farms
        for i in range(num_poultry_farms):
            state = random.choice(self.poultry_states)
            farm = self.generate_poultry_farm(i+1, state)
            farms.append(farm)
            
            if (i+1) % 100 == 0:
                print(f"  Generated {i+1} poultry farms...")
        
        print(f"\nTotal farms generated: {len(farms)}")
        
        # Convert to DataFrame
        df = pd.DataFrame(farms)
        
        # Generate statistics
        self._print_statistics(df)
        
        return df
    
    def _print_statistics(self, df):
        """Print dataset statistics"""
        print("\n" + "="*60)
        print("SYNTHETIC FARM DATASET STATISTICS")
        print("="*60)
        
        print(f"\nTotal Farms: {len(df)}")
        print(f"  - Pig Farms: {len(df[df['farm_type'] == 'pig'])}")
        print(f"  - Poultry Farms: {len(df[df['farm_type'] == 'poultry'])}")
        
        print(f"\nBiosecurity Score Distribution:")
        print(f"  - Mean: {df['biosecurity_score'].mean():.2f}")
        print(f"  - Median: {df['biosecurity_score'].median():.2f}")
        print(f"  - Std Dev: {df['biosecurity_score'].std():.2f}")
        
        print(f"\nRisk Level Distribution:")
        for risk in ['Low', 'Medium', 'High', 'Critical']:
            count = len(df[df['risk_level'] == risk])
            pct = (count / len(df)) * 100
            print(f"  - {risk}: {count} ({pct:.1f}%)")
        
        print(f"\nPig Farm Statistics (from {len(df[df['farm_type'] == 'pig'])} farms):")
        pig_df = df[df['farm_type'] == 'pig']
        print(f"  - ASF Awareness: {(pig_df['asf_awareness'].sum() / len(pig_df) * 100):.1f}%")
        print(f"  - Swill Feeding: {(pig_df['swill_feeding'].sum() / len(pig_df) * 100):.1f}%")
        print(f"  - Wild Boar Hunting: {(pig_df['wild_boar_hunting'].sum() / len(pig_df) * 100):.1f}%")
        print(f"  - Mean Biosecurity Score: {pig_df['biosecurity_score'].mean():.2f}")
        
        print(f"\nPoultry Farm Statistics (from {len(df[df['farm_type'] == 'poultry'])} farms):")
        poultry_df = df[df['farm_type'] == 'poultry']
        print(f"  - Mean Biosecurity Score: {poultry_df['biosecurity_score'].mean():.2f}")
        print(f"  - Received Training: 100%")
        
        print("\n" + "="*60)

def main():
    """Main execution function"""
    print("SIH 2025 - Synthetic Farm Data Generator")
    print("Calibrated to real research data from NE India and Tamil Nadu\n")
    
    # Initialize generator
    generator = FarmDataGenerator()
    
    # Generate dataset
    df = generator.generate_dataset(num_pig_farms=600, num_poultry_farms=400)
    
    # Save to CSV
    output_file = 'data/processed/synthetic_farms_1000.csv'
    df.to_csv(output_file, index=False)
    print(f"\n✓ Dataset saved to: {output_file}")
    
    # Save summary statistics
    summary = {
        'total_farms': len(df),
        'pig_farms': len(df[df['farm_type'] == 'pig']),
        'poultry_farms': len(df[df['farm_type'] == 'poultry']),
        'mean_biosecurity_score': float(df['biosecurity_score'].mean()),
        'risk_distribution': df['risk_level'].value_counts().to_dict(),
        'generated_at': datetime.now().isoformat(),
        'data_sources': [
            'PMC10352026 - NE India Pig Farm Survey (1000 farms)',
            'PMC12051024 - Tamil Nadu Poultry Training Study (89 farms)'
        ]
    }
    
    with open('data/processed/dataset_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"✓ Summary saved to: data/processed/dataset_summary.json")
    print("\n✓ Synthetic farm data generation complete!")

if __name__ == '__main__':
    main()
