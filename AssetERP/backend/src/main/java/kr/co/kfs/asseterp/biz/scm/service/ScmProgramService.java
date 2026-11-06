package kr.co.kfs.asseterp.biz.scm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramVersionRes;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmDevProgramMapper;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmProgramMapper;
import kr.co.kfs.asseterp.biz.sys.service.SysFileService;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/** AS-IS Scm30_Tab_Program·Scm30_Lookup_Program·Scm30_Edit_Program·Scm30_Lookup_MultiUpload (EE19) → server/scm/Scm30_Program(selectByPaging L40 / selectBySystemCode L64 / modelUpdate L86) + FileUpload.uploadScm30 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScmProgramService {

    private final ScmProgramMapper mapper;
    private final ScmDevProgramMapper devProgramMapper;
    private final SysFileService sysFileService;

    /** AS-IS Scm30_Program.selectByPaging — 시스템·구분·사용여부·"%검색어%" (사용여부 '%'=전체) */
    public PageRes<ProgramRes> search(UserPrincipal user, String systemCode, String programType, String useYn, String searchText, int offset, int limit) {
        String type = programType == null || programType.isEmpty() ? "%" : programType;
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        return new PageRes<>(mapper.selectByCompanyIdTotal(user.getCompanyId(), systemCode, useYn, type, text),
                mapper.selectByCompanyIdPaging(user.getCompanyId(), systemCode, useYn, type, text, limit, offset));
    }

    /** AS-IS Scm30_Program.selectBySystemCode — 프로그램 Version 조회창 */
    public List<ProgramVersionRes> versions(UserPrincipal user, String systemCode, String programType, String programCode) {
        return mapper.selectBySystemCode(user.getCompanyId(), systemCode, programType, programCode);
    }

    /**
     * AS-IS Scm30_Program.modelUpdate — 등록(new)이면 같은 시스템·구분·ID의 최신 버전 + 1(없으면 1, 프로그램명이 비면 전 버전 이름),
     * 수정(edit)이면 버전 그대로. 등록일시는 등록이면 지금, 수정이면 원래 값. 결과는 저장된 한 줄(selectById)
     */
    @Transactional
    public ProgramRes save(UserPrincipal user, ProgramSaveReq req) {
        if (req.programId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "프로그램 번호가 없습니다");
        if (req.systemCd() == null || req.systemCd().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "시스템을 선택해주세요");
        if (req.programType() == null || req.programType().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "구분을 선택해주세요");
        if (req.programCd() == null || req.programCd().trim().isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "프로그램ID를 입력해주세요");
        boolean isNew = "new".equals(req.insertWay());
        String programCd = req.programCd().trim();
        Long version = req.version();
        String programNm = req.programNm();
        if (isNew) {
            List<ProgramRes> latest = devProgramMapper.selectByProgramCode(user.getCompanyId(), req.systemCd(), req.programType(), programCd);
            if (latest.isEmpty()) {
                version = 1L;
            } else {
                for (ProgramRes p : latest) {
                    version = (p.version() == null ? 0 : p.version()) + 1;
                    if (programNm == null || programNm.isEmpty()) programNm = p.programNm();
                }
            }
        }
        mapper.upsertProgram(req.programId(), req.systemCd(), req.programType(), programCd, programNm, req.source(),
                version, user.getUserId(), req.note(), req.useYn() == null ? "false" : req.useYn());
        devProgramMapper.updateRegDate(req.programId(), isNew || req.regDate() == null ? LocalDateTime.now() : req.regDate());
        return mapper.selectById(req.programId());
    }

    /**
     * AS-IS FileUpload.uploadScm30 (mode=scm30) — 고른 파일마다 ① 프로그램(scm30: 파일명에서 확장자를 뺀 코드, 같은 시스템·구분·코드의 최신 버전 + 1,
     * 없으면 1, 사용) ② 첨부파일(sys10_file, parentId = 프로그램번호)을 만든다. 한 트랜잭션 — 하나라도 실패하면 모두 되돌린다
     */
    @Transactional
    public int multiUpload(UserPrincipal user, String systemCd, String programType, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "업로드 파일 없음");
        int count = 0;
        for (MultipartFile file : files) {
            String name = file == null ? null : file.getOriginalFilename();
            if (file == null || file.isEmpty() || name == null) continue;
            int dot = name.lastIndexOf('.');
            String programCd = dot < 0 ? name : name.substring(0, dot);
            long programId = devProgramMapper.selectNextId();
            long version = 1L;
            for (ProgramRes p : devProgramMapper.selectByProgramCode(user.getCompanyId(), systemCd, programType, programCd)) {
                version = (p.version() == null ? 0 : p.version()) + 1;
            }
            mapper.upsertProgram(programId, systemCd, programType, programCd, null, null, version, user.getUserId(), null, "true");
            devProgramMapper.updateRegDate(programId, LocalDateTime.now());
            sysFileService.upload(user, programId, null, "false", file);
            count++;
        }
        return count;
    }
}
