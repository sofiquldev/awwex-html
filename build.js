const fs = require('fs');
const path = require('path');

class HTMLComponentBuilder {
    constructor() {
        this.components = new Map();
        this.layouts = new Map();
        this.srcDir = './src';
        this.componentsDir = './src/components';
        this.layoutsDir = './src/layouts';
        this.pagesDir = './src/pages';
        this.distDir = './';
    }

    // Load component files
    loadComponents() {
        console.log('Loading components...');
        
        if (!fs.existsSync(this.componentsDir)) {
            fs.mkdirSync(this.componentsDir, { recursive: true });
        }

        const componentFiles = fs.readdirSync(this.componentsDir).filter(file => file.endsWith('.html'));
        
        componentFiles.forEach(file => {
            const componentName = path.basename(file, '.html');
            const componentPath = path.join(this.componentsDir, file);
            const componentContent = fs.readFileSync(componentPath, 'utf8');
            
            this.components.set(componentName, componentContent);
            console.log(`✓ Loaded component: ${componentName}`);
        });
    }

    // Load layout files
    loadLayouts() {
        console.log('Loading layouts...');
        
        if (!fs.existsSync(this.layoutsDir)) {
            fs.mkdirSync(this.layoutsDir, { recursive: true });
        }

        const layoutFiles = fs.readdirSync(this.layoutsDir).filter(file => file.endsWith('.html'));
        
        layoutFiles.forEach(file => {
            const layoutName = path.basename(file, '.html');
            const layoutPath = path.join(this.layoutsDir, file);
            const layoutContent = fs.readFileSync(layoutPath, 'utf8');
            
            this.layouts.set(layoutName, layoutContent);
            console.log(`✓ Loaded layout: ${layoutName}`);
        });
    }

    // Replace component tags with actual component content
    replaceComponents(content) {
        // Replace <component:name props /> tags
        content = content.replace(/<component:([\w-]+)([^>]*?)\s*\/>/gs, (match, componentName, propsString) => {
            if (this.components.has(componentName)) {
                let componentContent = this.components.get(componentName);
                
                // Parse props
                const props = this.parseProps(propsString);
                
                // Replace placeholders with prop values
                componentContent = this.replacePlaceholders(componentContent, props);
                
                return componentContent;
            }
            console.warn(`⚠ Component "${componentName}" not found`);
            return match;
        });

        // Replace <component:name>content</component:name> tags (with slot content)
        content = content.replace(/<component:([\w-]+)([^>]*?)>([\s\S]*?)<\/component:\1>/g, (match, componentName, propsString, slotContent) => {
            if (this.components.has(componentName)) {
                let componentContent = this.components.get(componentName);
                
                // Parse props
                const props = this.parseProps(propsString);
                
                // Parse slots from content
                const slots = this.parseSlots(slotContent);
                
                // Replace slot placeholders
                Object.keys(slots).forEach(slotName => {
                    const slotRegex = new RegExp(`\\{\\{slot:${slotName}\\}\\}`, 'g');
                    componentContent = componentContent.replace(slotRegex, slots[slotName]);
                });
                
                // Replace {{slot}} with the main content
                componentContent = componentContent.replace(/\{\{slot\}\}/g, slotContent.trim());
                
                // Replace placeholders with prop values
                componentContent = this.replacePlaceholders(componentContent, props);
                
                return componentContent;
            }
            console.warn(`⚠ Component "${componentName}" not found`);
            return match;
        });

        return content;
    }

    // Parse component props from string
    parseProps(propsString) {
        const props = {};
        if (!propsString) return props;
        
        // Match prop="value" or prop='value' patterns
        const propRegex = /(\w+)=["']([^"']*?)["']/g;
        let match;
        
        while ((match = propRegex.exec(propsString)) !== null) {
            props[match[1]] = match[2];
        }
        
        return props;
    }

    // Parse slots from content
    parseSlots(content) {
        const slots = {};
        
        // Match <div slot="name">content</div> patterns
        const slotRegex = /<[^>]+slot=["'](\w+)["'][^>]*>([\s\S]*?)<\/[^>]+>/g;
        let match;
        
        while ((match = slotRegex.exec(content)) !== null) {
            slots[match[1]] = match[2].trim();
        }
        
        return slots;
    }

    // Replace placeholders with actual values
    replacePlaceholders(content, props) {
        // Replace {{prop}} placeholders
        Object.keys(props).forEach(prop => {
            const regex = new RegExp(`\\{\\{${prop}\\}\\}`, 'g');
            content = content.replace(regex, props[prop]);
        });
        
        // Handle conditional rendering {{#if prop}}...{{/if}}
        content = content.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, innerContent) => {
            // Simple condition check - if prop exists and is truthy
            const propName = condition.trim();
            if (props[propName] && props[propName] !== 'false') {
                return innerContent;
            }
            return '';
        });
        
        return content;
    }

    // Replace layout tags
    replaceLayout(content) {
        const layoutMatch = content.match(/<layout:([\w-]+)([^>]*?)>([\s\S]*?)<\/layout:\1>/);
        
        if (layoutMatch) {
            const [fullMatch, layoutName, propsString, pageContent] = layoutMatch;
            
            if (this.layouts.has(layoutName)) {
                let layoutContent = this.layouts.get(layoutName);
                
                // Parse layout props
                const props = this.parseProps(propsString);
                
                // Replace {{content}} with the page content
                layoutContent = layoutContent.replace(/\{\{content\}\}/g, pageContent.trim());
                
                // Replace other placeholders (like {{title}})
                layoutContent = this.replacePlaceholders(layoutContent, props);
                
                // Set default title if not provided
                if (!props.title) {
                    layoutContent = layoutContent.replace(/\{\{title\}\}/g, 'AwwEx');
                }
                
                return layoutContent;
            } else {
                console.warn(`⚠ Layout "${layoutName}" not found`);
                return content;
            }
        }
        
        return content;
    }

    // Build a single page
    buildPage(pagePath) {
        console.log(`Building page: ${pagePath}`);
        
        let content = fs.readFileSync(pagePath, 'utf8');
        
        // First replace layout
        content = this.replaceLayout(content);
        
        // Then replace components (do this multiple times to handle nested components)
        let previousContent;
        let iterations = 0;
        const maxIterations = 10; // Prevent infinite loops
        
        do {
            previousContent = content;
            content = this.replaceComponents(content);
            iterations++;
        } while (content !== previousContent && iterations < maxIterations);
        
        if (iterations >= maxIterations) {
            console.warn(`⚠ Maximum iterations reached for ${pagePath}. Possible circular component references.`);
        }
        
        return content;
    }

    // Build all pages
    build() {
        console.log('🚀 Starting HTML Component Build...\n');
        
        // Ensure dist directory exists
        if (!fs.existsSync(this.distDir)) {
            fs.mkdirSync(this.distDir, { recursive: true });
        }

        // Load components and layouts
        this.loadComponents();
        this.loadLayouts();
        
        console.log('');
        
        // Build pages
        if (!fs.existsSync(this.pagesDir)) {
            fs.mkdirSync(this.pagesDir, { recursive: true });
        }

        const pageFiles = fs.readdirSync(this.pagesDir).filter(file => file.endsWith('.html'));
        
        if (pageFiles.length === 0) {
            console.log('No pages found in src/pages directory');
            return;
        }

        pageFiles.forEach(file => {
            const pagePath = path.join(this.pagesDir, file);
            const outputPath = path.join(this.distDir, file);
            
            try {
                const builtContent = this.buildPage(pagePath);
                fs.writeFileSync(outputPath, builtContent, 'utf8');
                console.log(`✓ Built: ${file}`);
            } catch (error) {
                console.error(`✗ Error building ${file}:`, error.message);
            }
        });
        
        console.log(`\n🎉 Build completed! Files are in the ${this.distDir} directory`);
    }

    // Watch for changes and rebuild
    watch() {
        console.log('👀 Watching for changes...\n');
        
        const watchDirs = [this.componentsDir, this.layoutsDir, this.pagesDir];
        
        watchDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                fs.watch(dir, { recursive: true }, (eventType, filename) => {
                    if (filename && filename.endsWith('.html')) {
                        console.log(`📝 File changed: ${filename}`);
                        console.log('🔄 Rebuilding...\n');
                        this.build();
                        console.log('');
                    }
                });
            }
        });
        
        // Initial build
        this.build();
    }
}

// CLI usage
const args = process.argv.slice(2);
const builder = new HTMLComponentBuilder();

if (args.includes('--watch') || args.includes('-w')) {
    builder.watch();
} else {
    builder.build();
}
