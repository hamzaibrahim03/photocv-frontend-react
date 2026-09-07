import { useRef } from "react";
function Step2Appearance() {
    const logoFile = useRef(null);
    const coverimageFile = useRef(null);
    const headerimageFile = useRef(null);
    const footerimageFile = useRef(null);
    // function onLogoChange(event) {
    //     const file=event.target.files[0];
    //     if (file) {
    //         logoFile.value=file;
    //         clubStore.step2.logo=file;
    //     }
    // }
    // function onCoverImageChange(event) {
    //     const file=event.target.files[0];
    //     if (file) {
    //         coverimageFile.value=file;
    //         clubStore.step2.cover_image=file;
    //     }
    // }
    // function onHeaderImageChange(event) {
    //     const file=event.target.files[0];
    //     if (file) {
    //         headerimageFile.value=file;
    //         clubStore.step2.header_img=file;
    //     }
    // }
    // function onFooterImageChange(event) {
    //     const file=event.target.files[0];
    //     if (file) {
    //         footerimageFile.value=file;
    //         clubStore.step2.footer_img=file;
    //     }
    // }
    return (
        <>
            <div className="form-container">
                <form style={{ marginLeft: '2%', marginRight: '2%' }}>
                    <h5 className="role" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '32px', lineHeight: '100%', letterSpacing: '0%' }}>Appearance & Branding</h5>
                    <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '22.88px', lineHeight: '100%', letterSpacing: '0%', color: '#4C4036;' }}>Each club has its own design Preference, let us know yours.</p>
                    <br /><br />
                    <div className="row">
                        <div className="col-md-6">
                            <label for="theme"> Theme & Colours </label>
                            <img src="@/assets/images/club/theme.png" alt="theme" /><br />
                            <label for="specific"> Choose Specific Colours </label>
                            <img src="@/assets/images/club/color.png" alt="color" />
                        </div>
                        <div className="col-md-6">
                            <label for="fonts"> Typography & Fonts </label>
                            <img src="@/assets/images/club/font.png" alt="font" style={{ height: "250px" }} />
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <h5>Header Customization</h5>
                            <label for="header">Title</label>
                            <input type="text" className="form-control" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <h5>Footer Customization</h5>
                            <label for="footer">Title</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label for="header">Description</label>
                            <textarea type="text" className="form-control"> </textarea>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label for="header">Description</label>
                            <textarea type="text" className="form-control"> </textarea>
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label for="logo"> Upload Image </label>
                            <input type="file" className="form-control" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label for="banner"> Upload Image </label>
                            <input type="file" className="form-control" />
                        </div>
                    </div>
                    <div className="divider3"></div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label for="logo"> Logo </label>
                            <input type="file" className="form-control" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label for="banner"> Club Banner and Cover Image </label>
                            <input type="file" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label for="logo"> Favicon </label>
                            <input type="file" className="form-control" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label for="banner"> Uploaded Images </label>
                        </div>
                    </div>
                    <div className="button-group" style={{ justifyContent: 'left' }}>
                        <button className="btn btn-sm" id="e-view"> Cancel</button>
                        <button type="submit" className="btn btn-sm" id="edit"> Save</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Step2Appearance;