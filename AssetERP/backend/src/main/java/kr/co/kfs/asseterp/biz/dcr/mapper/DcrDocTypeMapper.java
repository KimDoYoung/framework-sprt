package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeUpdateReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr05_doc_type.xml + UpdateDataModel(dcr05_doc_type) — 문서양식 */
@Mapper
public interface DcrDocTypeMapper {
    /** AS-IS selectByName: 양식 제목+비고 LIKE(대소문자 무시)·구분 LIKE, 회사의 구분 코드명 붙임. 둘 다 LIKE 패턴 */
    List<DcrDocTypeRes> selectByName(@Param("companyId") Long companyId, @Param("titleName") String titleName,
                                     @Param("formClassCode") String formClassCode);

    DcrDocTypeRes selectById(@Param("docTypeId") Long docTypeId, @Param("companyId") Long companyId);

    /** Dcr05_Edit_Update.updateEdit (UpdateDataModel) */
    int updateEdit(@Param("companyId") Long companyId, @Param("docTypeId") Long docTypeId, @Param("req") DcrDocTypeUpdateReq req);
}
