import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'migracion_compras_proveed_detalles.xlsx');

console.log('🔍 ANÁLISIS DETALLADO DEL ARCHIVO DE MIGRACIÓN');
console.log('='.repeat(80));
console.log(`Archivo: ${filePath}\n`);

if (!fs.existsSync(filePath)) {
  console.error(`❌ Error: No se encontró el archivo en ${filePath}`);
  process.exit(1);
}

try {
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  
  console.log(`📊 RESUMEN GENERAL`);
  console.log(`   - Número de hojas: ${sheetNames.length}`);
  console.log(`   - Hojas: ${sheetNames.join(', ')}\n`);
  
  const analysis: Record<string, any> = {
    metadata: {
      fileName: 'migracion_compras_proveed_detalles.xlsx',
      sheetCount: sheetNames.length,
      sheets: sheetNames,
      analyzedAt: new Date().toISOString()
    },
    sheets: {}
  };
  
  sheetNames.forEach((sheetName, index) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📋 HOJA ${index + 1}/${sheetNames.length}: "${sheetName}"`);
    console.log('='.repeat(80));
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: null, raw: false });
    
    if (data.length === 0) {
      console.log('⚠️  La hoja está vacía');
      analysis.sheets[sheetName] = {
        rowCount: 0,
        columns: [],
        isEmpty: true
      };
      return;
    }
    
    const firstRow = data[0] as any;
    const columns = Object.keys(firstRow);
    
    console.log(`\n📊 ESTADÍSTICAS:`);
    console.log(`   - Total de filas: ${data.length}`);
    console.log(`   - Total de columnas: ${columns.length}`);
    
    console.log(`\n📝 COLUMNAS (${columns.length}):`);
    columns.forEach((col, i) => {
      const sampleValues = data.slice(0, 50)
        .map((row: any) => row[col])
        .filter((v: any) => v != null && v !== '');
      const filledCount = sampleValues.length;
      const uniqueCount = new Set(sampleValues).size;
      const types = [...new Set(sampleValues.map((v: any) => {
        if (v === null || v === undefined) return 'null';
        if (typeof v === 'number') return 'number';
        if (typeof v === 'boolean') return 'boolean';
        if (typeof v === 'string') {
          if (!isNaN(Number(v)) && v.trim() !== '') return 'string-number';
          if (v.match(/^\d{4}-\d{2}-\d{2}/)) return 'date';
          return 'string';
        }
        return typeof v;
      }))];
      
      console.log(`   ${(i + 1).toString().padStart(2, ' ')}. ${col}`);
      console.log(`       - Filas con datos: ${filledCount}/${data.length} (${Math.round(filledCount/data.length*100)}%)`);
      console.log(`       - Valores únicos: ${uniqueCount}`);
      console.log(`       - Tipos detectados: ${types.join(', ')}`);
      if (sampleValues.length > 0) {
        console.log(`       - Ejemplos: ${sampleValues.slice(0, 3).map((v: any) => String(v).substring(0, 30)).join(', ')}`);
      }
    });
    
    console.log(`\n📋 MUESTRA DE DATOS (primeras 3 filas):`);
    console.log(JSON.stringify(data.slice(0, 3), null, 2));
    
    // Análisis de relaciones y dependencias
    console.log(`\n🔗 ANÁLISIS DE RELACIONES:`);
    const potentialKeys = columns.filter(col => {
      const values = data.map((row: any) => row[col]).filter((v: any) => v != null);
      const uniqueCount = new Set(values).size;
      return uniqueCount === data.length || (uniqueCount > 0 && uniqueCount < data.length * 0.1);
    });
    
    if (potentialKeys.length > 0) {
      console.log(`   - Posibles claves primarias/foráneas: ${potentialKeys.join(', ')}`);
    }
    
    // Análisis de valores nulos
    console.log(`\n📊 ANÁLISIS DE COMPLETITUD:`);
    columns.forEach(col => {
      const nullCount = data.filter((row: any) => row[col] == null || row[col] === '').length;
      if (nullCount > 0) {
        console.log(`   - ${col}: ${nullCount} valores nulos/vacíos (${Math.round(nullCount/data.length*100)}%)`);
      }
    });
    
    analysis.sheets[sheetName] = {
      rowCount: data.length,
      columns: columns,
      columnAnalysis: columns.map((col: string) => {
        const values = data.map((row: any) => row[col]).filter((v: any) => v != null && v !== '');
        return {
          name: col,
          filledCount: values.length,
          uniqueCount: new Set(values).size,
          sampleValues: values.slice(0, 5)
        };
      }),
      sampleData: data.slice(0, 10),
      allData: data
    };
  });
  
  // Guardar análisis completo
  const outputPath = path.join(process.cwd(), 'analisis_migracion_completo.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log(`\n\n✅ Análisis completo guardado en: ${outputPath}`);
  
  // Generar resumen para el modelo de datos
  console.log(`\n\n📋 RESUMEN PARA MODELO DE DATOS:`);
  console.log('='.repeat(80));
  sheetNames.forEach(sheetName => {
    const sheetData = analysis.sheets[sheetName];
    if (sheetData && !sheetData.isEmpty) {
      console.log(`\n📊 ${sheetName}:`);
      console.log(`   - Filas: ${sheetData.rowCount}`);
      console.log(`   - Columnas: ${sheetData.columns.join(', ')}`);
    }
  });
  
} catch (error: any) {
  console.error('❌ Error:', error.message);
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('\n💡 Instala la dependencia: npm install xlsx');
    console.error('   Luego ejecuta: npx tsx scripts/analizar-migracion.ts');
  }
  process.exit(1);
}

