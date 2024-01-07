import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import BucketRepository from '../../repository/bucket.repo';

const HomePage = () => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    useEffect(() => {
        BucketRepository.put({
            id: 'test',
            month: new Date(),
            amount: 1000,
            name: 'test',
            status: 'open'
        })
    }, []);

    const files = acceptedFiles.map(file => (
        <li key={file.name}>
            {file.name} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>

    );
}

export {
    HomePage
}